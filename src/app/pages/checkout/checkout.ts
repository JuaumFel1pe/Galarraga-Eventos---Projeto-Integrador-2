import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
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

  ngOnInit() {
    this.eventosService.detalhe(this.idEvento).pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: ({ evento, tipos }) => {
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
    if (this.enviando() || !this.quantidadeValida() || quantidade === null) return;
    this.enviando.set(true);
    this.erro.set('');
    this.pedidosService.confirmar([{ idTipoIngresso: this.idTipo(), quantidade }])
      .pipe(finalize(() => this.enviando.set(false))).subscribe({
        next: pedido => void this.router.navigate(['/perfil'], { queryParams: { pedido: pedido.id, confirmado: 'sim' } }),
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível confirmar o pedido. Confira seu histórico antes de tentar de novo.')),
      });
  }
}
