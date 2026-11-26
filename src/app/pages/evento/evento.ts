import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';
import { erroApi, moeda } from '../../services/api.utils';
import { EventosService, Evento as EventoModel, imagemPadrao } from '../../services/eventos.service';

@Component({
  selector: 'app-evento', imports: [Cabecalho, Rodape, RouterLink, AsyncPipe, DatePipe],
  templateUrl: './evento.html', styleUrl: './evento.css',
})
export class Evento {
  private readonly eventosService = inject(EventosService);
  readonly imagemPadrao = imagemPadrao;
  readonly moeda = moeda;
  readonly estado = inject(ActivatedRoute).paramMap.pipe(
    switchMap(params => this.eventosService.detalhe(Number(params.get('id'))).pipe(
      map(dados => ({ dados, erro: '', carregando: false })),
      catchError(erro => of({ dados: null, erro: erroApi(erro, 'Evento não encontrado.'), carregando: false })),
      startWith({ dados: null, erro: '', carregando: true }),
    )),
  );

  aberto(evento: EventoModel) {
    return evento.status === 'ATIVO' && new Date(evento.dataFim).getTime() > Date.now();
  }
}
