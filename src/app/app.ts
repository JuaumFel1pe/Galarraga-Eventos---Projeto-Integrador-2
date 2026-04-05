import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';
import { PagInicial } from './components/pag-inicial/pag-inicial';
import { Sessao2 } from './components/sessao2/sessao2';
import { Sessao3 } from './components/sessao3/sessao3';
import { EventosDisponiveis } from './components/eventos-disponiveis/eventos-disponiveis';
import { Sessao6 } from './components/sessao6/sessao6';
import { Sobre } from './components/sobre/sobre';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Rodape, Sessao6, Sobre, EventosDisponiveis, PagInicial, Sessao3, Sessao2],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Galarraga Eventos');
}
