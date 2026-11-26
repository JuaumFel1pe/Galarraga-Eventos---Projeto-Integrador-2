import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingresso, Pedido } from './pedidos.service';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  constructor(private readonly http: HttpClient) {}

  consultar(): Observable<Venda[]> {
    return this.http.get<Venda[]>('/api/pedidos/admin');
  }

  checkIn(codigoQr: string): Observable<Ingresso> {
    return this.http.post<Ingresso>('/api/ingressos/validar', { codigoQr });
  }
}

export interface Venda {
  id: number;
  cliente: string;
  dataPedido: string;
  valorTotal: number;
  status: Pedido['status'];
  quantidade: number;
  cancelavel: boolean;
}
