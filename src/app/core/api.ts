import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import {
  Categoria, Configuracao, Evento, Ingresso, LocalEvento, Pedido, TipoIngresso, Usuario, Venda,
} from './modelos';

export const imagemPadrao = '/fundo_eventos_disponiveis.png';

export const moeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export function erroApi(erro: unknown, fallback = 'Não foi possível concluir a operação.'): string {
  if (!(erro instanceof HttpErrorResponse)) return fallback;
  if (erro.status === 0 || erro.status === 502 || erro.status === 503 || erro.status === 504) {
    return 'Não foi possível conectar à API. Confira se ela está rodando e tente novamente.';
  }
  const campos: unknown = erro.error?.campos;
  if (campos && typeof campos === 'object') {
    return Object.entries(campos).map(([campo, msg]) => `${campo}: ${msg}`).join(' · ');
  }
  return (typeof erro.error?.detail === 'string' && erro.error.detail) || fallback;
}

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly http = inject(HttpClient);

  eventos() { return this.http.get<Evento[]>('/api/eventos'); }
  evento(id: number) { return this.http.get<Evento>('/api/eventos/' + id); }
  categorias() { return this.http.get<Categoria[]>('/api/categorias'); }
  locais() { return this.http.get<LocalEvento[]>('/api/locais'); }
  tipos(idEvento?: number) {
    return this.http.get<TipoIngresso[]>('/api/tipos-ingresso',
      idEvento === undefined ? {} : { params: { idEvento } });
  }

  catalogo() {
    return forkJoin({ eventos: this.eventos(), locais: this.locais(), categorias: this.categorias(), tipos: this.tipos() });
  }

  detalhe(id: number) {
    return forkJoin({ evento: this.evento(id), locais: this.locais(), categorias: this.categorias(), tipos: this.tipos(id) })
      .pipe(map(({ evento, locais, categorias, tipos }) => ({
        evento, tipos, local: locais.find(item => item.id === evento.idLocal),
        categoria: categorias.find(item => item.id === evento.idCategoria),
      })));
  }

  perfil() { return this.http.get<Usuario>('/api/usuarios/me'); }
  pedidos() { return this.http.get<Pedido[]>('/api/pedidos'); }
  pedido(id: number) { return this.http.get<Pedido>('/api/pedidos/' + id); }
  cancelar(id: number) { return this.http.patch<Pedido>('/api/pedidos/' + id + '/cancelar', null); }
  vendas() { return this.http.get<Venda[]>('/api/pedidos/admin'); }
  checkIn(codigoQr: string) { return this.http.post<Ingresso>('/api/ingressos/validar', { codigoQr }); }
  configuracao() { return this.http.get<Configuracao>('/api/configuracoes'); }
  salvarConfiguracao(dados: Configuracao) { return this.http.put<Configuracao>('/api/configuracoes', dados); }

  salvar<T extends { id: number }>(recurso: RecursoCatalogo, dados: Omit<T, 'id'>, id?: number) {
    const url = '/api/' + recurso;
    return id === undefined ? this.http.post<T>(url, dados) : this.http.put<T>(url + '/' + id, dados);
  }

  salvarTipo(dados: Omit<TipoIngresso, 'id' | 'quantidadeDisponivel'>, id?: number) {
    const url = '/api/tipos-ingresso';
    return id === undefined
      ? this.http.post<TipoIngresso>(url, dados)
      : this.http.put<TipoIngresso>(url + '/' + id, dados);
  }

  excluir(recurso: RecursoCatalogo, id: number) {
    return this.http.delete<void>('/api/' + recurso + '/' + id);
  }
}

export type RecursoCatalogo = 'eventos' | 'categorias' | 'locais' | 'tipos-ingresso';
