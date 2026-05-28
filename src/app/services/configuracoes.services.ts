import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesServices {
  private api = "http://localhost:3000/configuracoes"

  constructor(private http : HttpClient) { }

  buscar(): Observable<Configuracao> {
    return this.http.get<Configuracao>(this.api);
  }

  atualizar(config : Configuracao): Observable<Configuracao>{
    return this.http.put<Configuracao>(this.api, config)
  }
}

export interface Configuracao{
    endereco: string,
    telefone: string,
    email: string,
    facebook: string,
    instagram: string,
    linkedin: string,
    twitter: string
}