import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';
import { Api, erroApi, imagemPadrao, moeda } from '../../core/api';
import { Evento as EventoModel } from '../../core/modelos';

@Component({
  selector: 'app-evento', imports: [Cabecalho, Rodape, RouterLink, AsyncPipe, DatePipe],
  templateUrl: './evento.html', styleUrl: './evento.css',
})
export class Evento {
  private readonly api = inject(Api);
  readonly imagemPadrao = imagemPadrao;
  readonly moeda = moeda;
  readonly estado = inject(ActivatedRoute).paramMap.pipe(
    switchMap(params => this.api.detalhe(Number(params.get('id'))).pipe(
      map(dados => ({ dados, erro: '', carregando: false })),
      catchError(erro => of({ dados: null, erro: erroApi(erro, 'Evento não encontrado.'), carregando: false })),
      startWith({ dados: null, erro: '', carregando: true }),
    )),
  );

  aberto(evento: EventoModel) {
    return evento.status === 'ATIVO' && new Date(evento.dataFim).getTime() > Date.now();
  }
}
