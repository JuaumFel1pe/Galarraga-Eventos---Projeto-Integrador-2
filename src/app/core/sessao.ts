import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { Api } from './api';
import { Cadastro, Usuario } from './modelos';

const chave = 'galarraga.token';

@Injectable({ providedIn: 'root' })
export class Sessao {
  private readonly http = inject(HttpClient);
  private readonly api = inject(Api);
  private readonly tokenAtual = signal(sessionStorage.getItem(chave));
  private readonly usuarioAtual = signal<Usuario | null>(null);
  readonly token = this.tokenAtual.asReadonly();
  readonly usuario = this.usuarioAtual.asReadonly();

  entrar(email: string, senha: string) {
    return this.http.post<{ token: string }>('/auth/login', { email, senha }).pipe(
      switchMap(({ token }) => {
        this.tokenAtual.set(token);
        sessionStorage.setItem(chave, token);
        return this.carregarPerfil().pipe(catchError(erro => {
          this.sair();
          return throwError(() => erro);
        }));
      }),
    );
  }

  cadastrar(dados: Cadastro) {
    return this.http.post<Usuario>('/auth/register', dados);
  }

  carregarPerfil() {
    return this.api.perfil().pipe(tap(usuario => this.usuarioAtual.set(usuario)));
  }

  sair() {
    this.tokenAtual.set(null);
    this.usuarioAtual.set(null);
    sessionStorage.removeItem(chave);
  }
}

export const autenticacao: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  const sessao = inject(Sessao);
  const token = sessao.token();
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse && erro.status === 401 && sessao.token() === token) sessao.sair();
      return throwError(() => erro);
    }),
  );
};

export const exigirSessao: CanActivateFn = (rota, estado) => {
  const sessao = inject(Sessao);
  const router = inject(Router);
  const login = router.createUrlTree(['/login'], { queryParams: { voltar: estado.url } });
  if (!sessao.token()) return login;
  return sessao.carregarPerfil().pipe(
    map(usuario => !rota.data['admin'] || usuario.role === 'ADMIN' || router.createUrlTree(['/perfil'])),
    catchError(() => of(login)),
  );
};
