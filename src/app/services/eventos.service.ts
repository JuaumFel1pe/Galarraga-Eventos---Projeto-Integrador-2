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

  consultarId(id : number) : Observable<Evento>{
    return this.http.get<Evento>(`${this.api}/${id}`)
  }

  consultarAtivos(): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.api}?inativo=false`)
  }

  salvar(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.api, evento)
  }

  editar(evento : Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.api}/${evento.id}`, evento)
  }

  remover(id : number){
    return this.http.delete(`${this.api}/${id}`)
  }
}

export interface Evento{
  id: number,
  urlImg: string,
  nome: string,
  endereco: string,
  dataHora: string,
  qtd: number,
  preco: number,
  inativo: boolean,
  descricao: string,
  destaque: boolean
}
