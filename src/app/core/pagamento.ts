import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pedido } from './modelos';

export interface SelecaoIngresso {
  idTipoIngresso: number;
  quantidade: number;
}

/** O checkout usa este serviço para confirmar pedidos. Um gateway futuro entra aqui e na API. */
@Injectable({ providedIn: 'root' })
export class Pagamento {
  private readonly http = inject(HttpClient);

  confirmar(itens: SelecaoIngresso[]) {
    return this.http.post<Pedido>('/api/pedidos', { itens });
  }
}
