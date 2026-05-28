import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Venda, VendasService } from '../../services/vendas.service';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [CabecalhoAdm, MenuLateralAdm],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas {
  vendas: Venda[] = [];

  constructor(
    private vendasApi: VendasService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.buscar();
    });
  }

  buscar() {
    this.vendasApi.consultar().subscribe({
      next: (resp) => {
        this.vendas = resp;
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('Erro ao buscar dados do json-server:', erro);
      }
    });
  }

  reenviar(id: number) {
    alert(`Reenviando nota para o pedido com o ID: ${id}`);
  }

  cancelar(id: number) {
    this.vendasApi.remover(id).subscribe(() => {
      alert(`Cancelando o pedido ID ${id}`);
      this.buscar();
    });
  }

  formatarPreco(valor: number | null): string {
    if (valor === null) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}