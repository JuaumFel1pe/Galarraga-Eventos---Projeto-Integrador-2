import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly api = '/api/pedidos';

  constructor(private readonly http: HttpClient) {}

  consultar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.api);
  }

  consultarId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.api}/${id}`);
  }

  confirmar(itens: SelecaoIngresso[]): Observable<Pedido> {
    return this.http.post<Pedido>(this.api, { itens });
  }

  cancelar(id: number): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.api}/${id}/cancelar`, null);
  }
}

export interface SelecaoIngresso {
  idTipoIngresso: number;
  quantidade: number;
}

export interface Ingresso {
  id: number;
  idItem: number;
  codigoQr: string;
  status: 'VALIDO' | 'UTILIZADO' | 'CANCELADO';
  dataUso: string | null;
}

export interface ItemPedido {
  id: number;
  idTipoIngresso: number;
  quantidade: number;
  precoUnitario: number;
  ingressos: Ingresso[];
}

export interface Pedido {
  id: number;
  idUsuario: number;
  dataPedido: string;
  valorTotal: number;
  status: 'CONFIRMADO' | 'CANCELADO';
  itens: ItemPedido[];
}
