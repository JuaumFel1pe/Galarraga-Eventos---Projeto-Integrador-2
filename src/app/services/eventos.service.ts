import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private api = "http://localhost:3000/eventos"

  constructor(private http: HttpClient){}

  consultar(): Observable<EventoModel[]>{
    return this.http.get<EventoModel[]>(this.api);
  }

  consultarId(id : number) : Observable<EventoModel>{
    return this.http.get<EventoModel>(`${this.api}/${id}`)
  }

  consultarAtivos(): Observable<EventoModel[]>{
    return this.http.get<EventoModel[]>(`${this.api}?inativo=false`)
  }

  salvar(evento: EventoModel): Observable<EventoModel>{
    return this.http.post<EventoModel>(this.api, evento)
  }

  editar(evento : EventoModel): Observable<EventoModel>{
    return this.http.put<EventoModel>(`${this.api}/${evento.id}`, evento)
  }

  remover(id : number){
    return this.http.delete(`${this.api}/${id}`)
  }
}

export interface EventoModel{
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
