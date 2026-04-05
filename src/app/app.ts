import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';
import { Sessao6 } from './components/sessao6/sessao6';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cabecalho, Rodape, Sessao6],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('GalarragaEventos');
}
