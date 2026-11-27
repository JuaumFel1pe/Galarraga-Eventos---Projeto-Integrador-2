import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { erroApi, moeda } from '../../services/api.utils';
import { EventosService } from '../../services/eventos.service';
import { LoginService } from '../../services/login.service';
import { Pedido, PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-perfil', imports: [Cabecalho, RouterLink, DatePipe],
  templateUrl: './perfil.html',
  host: { '(document:visibilitychange)': 'aoVoltarParaAba()' },
})
export class Perfil {
  private readonly eventosService = inject(EventosService);
  private readonly pedidosService = inject(PedidosService);
  private readonly rota = inject(ActivatedRoute);
  readonly sessao = inject(LoginService);
  readonly erro = signal('');
  readonly carregando = signal(true);
  readonly pedidos = signal<Pedido[]>([]);
  readonly tipos = signal(new Map<number, string>());
  readonly cancelando = signal<number | null>(null);
  readonly sincronizando = signal<number | null>(null);
  readonly pagamentoConfirmado = signal<number | null>(null);
  private pagamentoAberto: number | null = null;
  readonly confirmado = Number(this.rota.snapshot.queryParamMap.get('pedido'));
  readonly veioDoCheckout = this.rota.snapshot.queryParamMap.get('confirmado') === 'sim';
  readonly moeda = moeda;

  ngOnInit() {
    forkJoin({ pedidos: this.pedidosService.consultar(), tipos: this.eventosService.tipos() })
      .pipe(finalize(() => this.carregando.set(false))).subscribe({
        next: ({ pedidos, tipos }) => {
          this.pedidos.set(pedidos);
          this.tipos.set(new Map(tipos.map(tipo => [tipo.id, tipo.nome])));
          const pendente = pedidos.find(p => p.id === this.confirmado && p.status === 'PENDENTE_PAGAMENTO');
          if (pendente && (pendente.urlPagamento || this.rota.snapshot.queryParamMap.get('mercadoPago') === 'sim')) {
            this.sincronizar(pendente);
          }
        },
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar seus pedidos.')),
      });
  }

  podeCancelar(pedido: Pedido) {
    return !pedido.mercadoPago && pedido.status === 'CONFIRMADO' && pedido.itens.every(item =>
      item.ingressos.every(ingresso => ingresso.status !== 'UTILIZADO'));
  }

  cancelar(pedido: Pedido) {
    if (this.cancelando() !== null || !window.confirm('Cancelar este pedido e invalidar seus ingressos?')) return;
    this.erro.set('');
    this.cancelando.set(pedido.id);
    this.pedidosService.cancelar(pedido.id).pipe(finalize(() => this.cancelando.set(null))).subscribe({
      next: atualizado => this.pedidos.update(lista => lista.map(item => item.id === atualizado.id ? atualizado : item)),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível cancelar o pedido.')),
    });
  }

  sincronizar(pedido: Pedido) {
    if (this.sincronizando() !== null) return;
    this.erro.set('');
    this.sincronizando.set(pedido.id);
    this.pedidosService.sincronizarPagamento(pedido.id).pipe(finalize(() => this.sincronizando.set(null))).subscribe({
      next: atualizado => {
        this.pedidos.update(lista => lista.map(item => item.id === atualizado.id ? atualizado : item));
        if (atualizado.status === 'CONFIRMADO') this.pagamentoConfirmado.set(atualizado.id);
      },
      error: erro => this.erro.set(erro.error?.detail || erroApi(erro, 'Não foi possível consultar o Mercado Pago.')),
    });
  }

  acompanharPagamento(id: number) {
    this.pagamentoAberto = id;
  }

  aoVoltarParaAba() {
    if (document.visibilityState !== 'visible') return;
    const pendente = this.pedidos().find(p => p.id === this.pagamentoAberto && p.status === 'PENDENTE_PAGAMENTO');
    if (pendente) this.sincronizar(pendente);
  }
}
