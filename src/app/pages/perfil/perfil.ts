import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Api, erroApi, moeda } from '../../core/api';
import { Pedido } from '../../core/modelos';
import { Sessao } from '../../core/sessao';

@Component({
  selector: 'app-perfil', imports: [Cabecalho, RouterLink, DatePipe],
  templateUrl: './perfil.html',
})
export class Perfil {
  private readonly api = inject(Api);
  private readonly rota = inject(ActivatedRoute);
  readonly sessao = inject(Sessao);
  readonly erro = signal('');
  readonly carregando = signal(true);
  readonly pedidos = signal<Pedido[]>([]);
  readonly tipos = signal(new Map<number, string>());
  readonly cancelando = signal<number | null>(null);
  readonly confirmado = Number(this.rota.snapshot.queryParamMap.get('pedido'));
  readonly veioDoCheckout = this.rota.snapshot.queryParamMap.get('confirmado') === 'sim';
  readonly moeda = moeda;

  ngOnInit() {
    forkJoin({ pedidos: this.api.pedidos(), tipos: this.api.tipos() })
      .pipe(finalize(() => this.carregando.set(false))).subscribe({
        next: ({ pedidos, tipos }) => {
          this.pedidos.set(pedidos);
          this.tipos.set(new Map(tipos.map(tipo => [tipo.id, tipo.nome])));
        },
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar seus pedidos.')),
      });
  }

  podeCancelar(pedido: Pedido) {
    return pedido.status === 'CONFIRMADO' && pedido.itens.every(item =>
      item.ingressos.every(ingresso => ingresso.status !== 'UTILIZADO'));
  }

  cancelar(pedido: Pedido) {
    if (this.cancelando() !== null || !window.confirm('Cancelar este pedido e invalidar seus ingressos?')) return;
    this.erro.set('');
    this.cancelando.set(pedido.id);
    this.api.cancelar(pedido.id).pipe(finalize(() => this.cancelando.set(null))).subscribe({
      next: atualizado => this.pedidos.update(lista => lista.map(item => item.id === atualizado.id ? atualizado : item)),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível cancelar o pedido.')),
    });
  }
}
