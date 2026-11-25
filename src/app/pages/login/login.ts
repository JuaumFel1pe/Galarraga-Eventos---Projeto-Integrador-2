import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';
import { erroApi } from '../../core/api';
import { Sessao } from '../../core/sessao';

@Component({
  selector: 'app-login', imports: [Cabecalho, Rodape, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly sessao = inject(Sessao);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);
  readonly mensagemErro = signal('');
  readonly enviando = signal(false);
  readonly formulario = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    senha: ['', [Validators.required, Validators.maxLength(72)]],
  });

  entrar() {
    if (this.enviando()) return;
    if (this.formulario.invalid) {
      this.mensagemErro.set('Informe um e-mail válido e sua senha.');
      return;
    }
    this.mensagemErro.set('');
    this.enviando.set(true);
    const { email, senha } = this.formulario.getRawValue();
    this.sessao.entrar(email.trim(), senha).pipe(finalize(() => this.enviando.set(false))).subscribe({
      next: usuario => {
        const voltar = this.rota.snapshot.queryParamMap.get('voltar');
        const destino = voltar?.startsWith('/') && !voltar.startsWith('//') && !voltar.includes('\\')
          ? voltar : usuario.role === 'ADMIN' ? '/dashboardadm' : '/perfil';
        void this.router.navigateByUrl(destino);
      },
      error: erro => this.mensagemErro.set(erroApi(erro, 'Não foi possível entrar. Confira seu e-mail e sua senha.')),
    });
  }
}
