import { HttpErrorResponse } from '@angular/common/http';

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
