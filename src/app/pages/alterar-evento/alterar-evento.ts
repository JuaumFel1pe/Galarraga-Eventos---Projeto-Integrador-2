import { formatDate } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, of } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { erroApi } from '../../services/api.utils';
import { EventosService, Categoria, Evento, LocalEvento } from '../../services/eventos.service';

@Component({
  selector: 'app-alterar-evento', imports: [FormsModule, RouterLink, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './alterar-evento.html',
})
export class AlterarEvento {
  private readonly eventosService = inject(EventosService);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly idSelecionado = Number(this.rota.snapshot.paramMap.get('id')) || undefined;
  readonly locais = signal<LocalEvento[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(true);
  readonly enviando = signal(false);
  readonly erro = signal('');
  readonly dataMinima = signal(this.horarioMinimo(Date.now()));
  evento: Omit<Evento, 'id'> = {
    idLocal: 0, idCategoria: 0, titulo: '', descricao: '', bannerUrl: '',
    dataInicio: '', dataFim: '', status: 'ATIVO',
  };

  ngOnInit() {
    forkJoin({
      locais: this.eventosService.locais(),
      categorias: this.eventosService.categorias(),
      evento: this.idSelecionado ? this.eventosService.consultarId(this.idSelecionado) : of(null),
    })
      .pipe(finalize(() => this.carregando.set(false))).subscribe({
        next: ({ locais, categorias, evento }) => {
          this.locais.set(locais);
          this.categorias.set(categorias);
          if (evento) {
            const { id, ...campos } = evento;
            this.evento = { ...campos, dataInicio: campos.dataInicio.slice(0, 16), dataFim: campos.dataFim.slice(0, 16) };
          }
        },
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar o formulário de eventos.')),
      });
  }

  atualizarDataMinima() {
    this.dataMinima.set(this.horarioMinimo(Date.now()));
  }

  salvarEvento() {
    if (this.enviando()) return;
    const agora = Date.now();
    const inicio = Date.parse(this.evento.dataInicio);
    const fim = Date.parse(this.evento.dataFim);
    this.dataMinima.set(this.horarioMinimo(agora));

    if (!Number.isFinite(inicio) || !Number.isFinite(fim)) {
      this.erro.set('Informe datas e horários válidos para o início e o fim do evento.');
      return;
    }
    if (inicio < agora || fim < agora) {
      this.erro.set('O início e o fim do evento devem ser iguais ou posteriores ao horário atual.');
      return;
    }
    if (fim <= inicio) {
      this.erro.set('O fim deve ser posterior ao início do evento.');
      return;
    }
    this.enviando.set(true);
    this.erro.set('');
    this.eventosService.salvar<Evento>('eventos', this.evento, this.idSelecionado)
      .pipe(finalize(() => this.enviando.set(false))).subscribe({
        next: () => void this.router.navigateByUrl('/meus-eventos'),
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível salvar o evento.')),
      });
  }

  private horarioMinimo(agora: number): string {
    // O campo trabalha com minutos inteiros. Arredonde para cima para evitar um horário já passado.
    const minuto = 60_000;
    return formatDate(Math.ceil(agora / minuto) * minuto, "yyyy-MM-dd'T'HH:mm", 'en-US');
  }
}
