import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';
import { EventosDisponiveis } from './components/eventos-disponiveis/eventos-disponiveis';
import { Sessao6 } from './components/sessao6/sessao6';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Rodape, Sessao6, EventosDisponiveis],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Galarraga Eventos');
}
