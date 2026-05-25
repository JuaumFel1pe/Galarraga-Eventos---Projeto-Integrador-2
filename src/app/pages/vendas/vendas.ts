import { Component } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Venda, VendasService } from '../../services/vendas.service';

@Component({
  selector: 'app-vendas',
  imports: [CabecalhoAdm, MenuLateralAdm],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas {
  constructor(private vendasApi: VendasService){}

  vendas : Venda[] = []

  ngOnInit(): void{
    this.buscar()
  }

  buscar(){
    this.vendasApi.consultar().subscribe(resp => this.vendas = resp)
  }

  reenviar(id: number){
    console.log(`Reenviando pedido para o ID ${id}`)
    //Simulação
  }

  cancelar(id: number){
    this.vendasApi.remover(id).subscribe(() => {
      alert(`Cancelando o pedido ID ${id}`)
      this.buscar()
    })
  }

  formatarPreco(valor: number | null): string {
    if (valor === null) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}
