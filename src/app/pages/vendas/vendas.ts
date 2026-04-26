import { Component } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';

@Component({
  selector: 'app-vendas',
  imports: [CabecalhoAdm, MenuLateralAdm],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas {}
