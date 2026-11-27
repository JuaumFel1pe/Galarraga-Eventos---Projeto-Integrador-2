import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { erroApi, moeda } from '../../services/api.utils';
import { Evento, EventosService, TipoIngresso } from '../../services/eventos.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-checkout', imports: [Cabecalho, RouterLink, FormsModule, DatePipe],
  templateUrl: './checkout.html',
})
export class Checkout {
  private readonly eventosService = inject(EventosService);
  private readonly pedidosService = inject(PedidosService);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly idEvento = Number(this.rota.snapshot.paramMap.get('id'));
  readonly evento = signal<Evento | null>(null);
  readonly tipos = signal<TipoIngresso[]>([]);
  readonly idTipo = signal(Number(this.rota.snapshot.queryParamMap.get('tipo')));
  readonly quantidade = signal<number | null>(1);
  readonly tipo = computed(() => this.tipos().find(item => item.id === this.idTipo()));
  readonly limite = computed(() => Math.min(this.tipo()?.quantidadeDisponivel ?? 0, 50));
  readonly quantidadeValida = computed(() => {
    const quantidade = this.quantidade();
    return quantidade !== null && Number.isInteger(quantidade) && quantidade >= 1 && quantidade <= this.limite();
  });
  readonly erro = signal('');
  readonly carregando = signal(true);
  readonly enviando = signal(false);
  readonly moeda = moeda;
  readonly pagamento = signal<{ modoTeste: boolean; configurado: boolean } | null>(null);
  private tentativa?: { selecao: string; chave: string };

  ngOnInit() {
    forkJoin({ detalhe: this.eventosService.detalhe(this.idEvento), configuracao: this.pedidosService.configuracaoPagamento() })
      .pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: ({ detalhe: { evento, tipos }, configuracao }) => {
        this.pagamento.set(configuracao);
        if (evento.status !== 'ATIVO' || new Date(evento.dataFim).getTime() <= Date.now()) {
          this.erro.set('Este evento não está disponível para compra.');
          return;
        }
        const disponiveis = tipos.filter(tipo => tipo.quantidadeDisponivel > 0);
        this.evento.set(evento);
        this.tipos.set(disponiveis);
        if (!this.tipo()) this.idTipo.set(disponiveis[0]?.id ?? 0);
      },
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível abrir o checkout.')),
    });
  }

  confirmar() {
    const quantidade = this.quantidade();
    const pagamento = this.pagamento();
    if (!pagamento || (pagamento.modoTeste && !pagamento.configurado) ||
        this.enviando() || !this.quantidadeValida() || quantidade === null) return;
    this.enviando.set(true);
    this.erro.set('');
    const itens = [{ idTipoIngresso: this.idTipo(), quantidade }];
    let pedido$ = this.pedidosService.confirmar(itens);
    if (pagamento.modoTeste) {
      const selecao = `${this.idTipo()}:${quantidade}`;
      if (this.tentativa?.selecao !== selecao) {
        this.tentativa = { selecao, chave: crypto.randomUUID() };
      }
      pedido$ = this.pedidosService.reservar(itens, this.tentativa.chave);
    }
    pedido$
      .pipe(finalize(() => this.enviando.set(false))).subscribe({
        next: pedido => void this.router.navigate(['/perfil'], {
          queryParams: { pedido: pedido.id, confirmado: pedido.mercadoPago ? null : 'sim',
            mercadoPago: pedido.mercadoPago ? 'sim' : null },
        }),
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível confirmar o pedido. Confira seu histórico antes de tentar de novo.')),
      });
  }
}
