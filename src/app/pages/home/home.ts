import { Component } from '@angular/core';

import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';
import { PagInicial } from '../../components/pag-inicial/pag-inicial';
import { Sessao2 } from '../../components/sessao2/sessao2';
import { Sessao3 } from '../../components/sessao3/sessao3';
import { EventosDisponiveis } from '../../components/eventos-disponiveis/eventos-disponiveis';
import { Sessao6 } from '../../components/sessao6/sessao6';
import { Sobre } from '../../components/sobre/sobre';

@Component({
  selector: 'app-home',
  imports: [Cabecalho, Rodape, PagInicial, Sessao2, Sessao3, EventosDisponiveis, Sessao6, Sobre],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
