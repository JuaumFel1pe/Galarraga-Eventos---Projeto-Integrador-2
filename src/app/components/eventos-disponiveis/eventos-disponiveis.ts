import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { erroApi, moeda } from '../../services/api.utils';
import { EventosService, Evento, imagemPadrao } from '../../services/eventos.service';

interface CardEvento extends Evento {
  local: string;
  categoria: string;
  preco: number | null;
  disponiveis: number;
}

@Component({
  selector: 'app-eventos-disponiveis', imports: [RouterLink, DatePipe],
  templateUrl: './eventos-disponiveis.html', styleUrl: './eventos-disponiveis.css',
})
export class EventosDisponiveis {
  private readonly eventosService = inject(EventosService);
  readonly eventos = signal<CardEvento[]>([]);
  readonly busca = signal('');
  readonly erro = signal('');
  readonly carregando = signal(true);
  readonly imagemPadrao = imagemPadrao;
  readonly moeda = moeda;
  readonly filtrados = computed(() => {
    const consulta = this.busca().trim().toLocaleLowerCase('pt-BR');
    return this.eventos().filter(evento =>
      [evento.titulo, evento.local, evento.categoria].some(valor => valor.toLocaleLowerCase('pt-BR').includes(consulta)));
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.erro.set('');
    this.eventosService.catalogo().subscribe({
      next: ({ eventos, categorias, locais, tipos }) => {
        this.eventos.set(eventos
          .filter(evento => evento.status === 'ATIVO' && new Date(evento.dataFim).getTime() > Date.now())
          .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
          .map(evento => {
            const tiposDoEvento = tipos.filter(tipo => tipo.idEvento === evento.id && tipo.quantidadeDisponivel > 0);
            return {
              ...evento,
              local: locais.find(local => local.id === evento.idLocal)?.nome ?? '',
              categoria: categorias.find(categoria => categoria.id === evento.idCategoria)?.nome ?? '',
              preco: tiposDoEvento.length ? Math.min(...tiposDoEvento.map(tipo => tipo.preco)) : null,
              disponiveis: tiposDoEvento.reduce((total, tipo) => total + tipo.quantidadeDisponivel, 0),
            };
          }));
        this.carregando.set(false);
      },
      error: erro => { this.erro.set(erroApi(erro, 'Não foi possível carregar os eventos.')); this.carregando.set(false); },
    });
  }
}
