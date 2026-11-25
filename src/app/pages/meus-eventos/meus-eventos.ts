import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Api, erroApi } from '../../core/api';
import { Evento } from '../../core/modelos';

interface LinhaEvento extends Evento {
  local: string;
  disponiveis: number;
}

@Component({
  selector: 'app-meus-eventos', imports: [DatePipe, CabecalhoAdm, MenuLateralAdm, RouterLink],
  templateUrl: './meus-eventos.html',
})
export class MeusEventos {
  private readonly api = inject(Api);
  readonly eventos = signal<LinhaEvento[]>([]);
  readonly filtroNome = signal('');
  readonly filtroStatus = signal('');
  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly excluindo = signal<number | null>(null);
  readonly filtrados = computed(() => this.eventos().filter(evento =>
    evento.titulo.toLowerCase().includes(this.filtroNome().trim().toLowerCase())
      && (!this.filtroStatus() || evento.status === this.filtroStatus())));

  ngOnInit() { this.buscar(); }

  buscar() {
    this.carregando.set(true);
    this.api.catalogo().pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: ({ eventos, locais, tipos }) => this.eventos.set(eventos.map(evento => ({
        ...evento,
        local: locais.find(local => local.id === evento.idLocal)?.nome ?? 'Local indisponível',
        disponiveis: tipos.filter(tipo => tipo.idEvento === evento.id)
          .reduce((total, tipo) => total + tipo.quantidadeDisponivel, 0),
      }))),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar os eventos.')),
    });
  }

  excluir(evento: Evento) {
    if (this.excluindo() !== null || !window.confirm('Excluir o evento ' + evento.titulo + '?')) return;
    this.erro.set('');
    this.excluindo.set(evento.id);
    this.api.excluir('eventos', evento.id).pipe(finalize(() => this.excluindo.set(null))).subscribe({
      next: () => this.eventos.update(lista => lista.filter(item => item.id !== evento.id)),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível excluir o evento.')),
    });
  }
}
