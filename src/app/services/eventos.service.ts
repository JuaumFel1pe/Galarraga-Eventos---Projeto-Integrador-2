import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private readonly api = '/api';

  constructor(private readonly http: HttpClient) {}

  consultar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.api}/eventos`);
  }

  consultarId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.api}/eventos/${id}`);
  }

  categorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.api}/categorias`);
  }

  locais(): Observable<LocalEvento[]> {
    return this.http.get<LocalEvento[]>(`${this.api}/locais`);
  }

  tipos(idEvento?: number): Observable<TipoIngresso[]> {
    const opcoes = idEvento === undefined ? {} : { params: { idEvento } };
    return this.http.get<TipoIngresso[]>(`${this.api}/tipos-ingresso`, opcoes);
  }

  catalogo() {
    return forkJoin({
      eventos: this.consultar(),
      locais: this.locais(),
      categorias: this.categorias(),
      tipos: this.tipos(),
    });
  }

  detalhe(id: number) {
    return forkJoin({
      evento: this.consultarId(id),
      locais: this.locais(),
      categorias: this.categorias(),
      tipos: this.tipos(id),
    }).pipe(
      map(({ evento, locais, categorias, tipos }) => ({
        evento,
        tipos,
        local: locais.find(item => item.id === evento.idLocal),
        categoria: categorias.find(item => item.id === evento.idCategoria),
      })),
    );
  }

  salvar<T extends { id: number }>(
    recurso: RecursoCatalogo,
    dados: Omit<T, 'id'>,
    id?: number,
  ): Observable<T> {
    const url = `${this.api}/${recurso}`;
    return id === undefined
      ? this.http.post<T>(url, dados)
      : this.http.put<T>(`${url}/${id}`, dados);
  }

  salvarTipo(
    dados: Omit<TipoIngresso, 'id' | 'quantidadeDisponivel'>,
    id?: number,
  ): Observable<TipoIngresso> {
    const url = `${this.api}/tipos-ingresso`;
    return id === undefined
      ? this.http.post<TipoIngresso>(url, dados)
      : this.http.put<TipoIngresso>(`${url}/${id}`, dados);
  }

  excluir(recurso: RecursoCatalogo, id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${recurso}/${id}`);
  }
}

export const imagemPadrao = '/fundo_eventos_disponiveis.png';

export type RecursoCatalogo = 'eventos' | 'categorias' | 'locais' | 'tipos-ingresso';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface LocalEvento {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  capacidade: number;
}

export interface Evento {
  id: number;
  idLocal: number;
  idCategoria: number;
  titulo: string;
  descricao: string | null;
  bannerUrl: string | null;
  dataInicio: string;
  dataFim: string;
  status: 'ATIVO' | 'CANCELADO' | 'ENCERRADO';
}

export interface TipoIngresso {
  id: number;
  idEvento: number;
  nome: string;
  preco: number;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
}
