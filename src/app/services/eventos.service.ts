import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private api = "http://localhost:3000/eventos"

  constructor(private http: HttpClient){}

  consultar(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.api);
  }
}

export interface Evento{
  id: number,
  nome: string,
  endereco: string,
  datahora: string,
  qtd: number,
  preco: number,
  inativo: boolean,
  descricao: string,
  destaque: boolean
}
