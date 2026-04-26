import { Component } from '@angular/core';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';

@Component({
  selector: 'app-evento',
  imports: [Cabecalho, Rodape],
  templateUrl: './evento.html',
  styleUrl: './evento.css',
})
export class Evento {}
