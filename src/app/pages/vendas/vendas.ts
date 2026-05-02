import { Component } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';

type Venda = {
  id: number;
  cliente: string;
  ingresso: string;
  status: 'Pago' | 'Pendente';
  data: string;
  valor: number;
}

@Component({
  selector: 'app-vendas',
  imports: [CabecalhoAdm, MenuLateralAdm],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas {
  vendas: Venda[] = [
    {id: 111155, cliente: "João Pedro", ingresso: "Festa de fim de ano", status: "Pago", data: "05/01/2025", valor: 125.00},
    { id: 122444, cliente: 'Rogério Santos', ingresso: 'Jantar Beneficiente', status: 'Pendente', data: '25/04/2025', valor: 280.00 },
    { id: 124455, cliente: 'Júlia Almeida', ingresso: 'Laureano "El miedo"', status: 'Pendente', data: '17/03/2025', valor: 167.00 }
  ]

  reenviar(id: number){
    console.log(`Reenviando pedido para o ID ${id}`)
    //Simulação
  }

  cancelar(id: number){
    console.log(`Cancelando o pedido ID ${id}`)
    //Simulação
  }

  formatarPreco(valor: number | null): string {
    if (valor === null) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}
