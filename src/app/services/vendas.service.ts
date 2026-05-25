import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
   private api = "http://localhost:3000/vendas"

  constructor(private http: HttpClient){}

  consultar(): Observable<Venda[]>{
    return this.http.get<Venda[]>(this.api);
  }

  remover(id : number){
    return this.http.delete(`${this.api}/${id}`)
  }
}

export interface Venda{
   id: number,
    cliente: string,
    ingresso: string,
    status: "Pago" | "Pendente" | string,
    data: string,
    valor: number
}