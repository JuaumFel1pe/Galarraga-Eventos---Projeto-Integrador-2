import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';
import { EventosDisponiveis } from './components/eventos-disponiveis/eventos-disponiveis';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Rodape, EventosDisponiveis],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Galarraga Eventos');
}
