import { Component } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';

@Component({
  selector: 'app-meus-eventos',
  imports: [CabecalhoAdm, MenuLateralAdm],
  templateUrl: './meus-eventos.html',
  styleUrl: './meus-eventos.css',
})
export class MeusEventos {}
