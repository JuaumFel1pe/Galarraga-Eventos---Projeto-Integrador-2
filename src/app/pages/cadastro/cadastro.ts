import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';
import { erroApi } from '../../core/api';
import { Sessao } from '../../core/sessao';

@Component({
  selector: 'app-cadastro', imports: [Cabecalho, Rodape, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
})
export class CadastroPagina {
  private readonly sessao = inject(Sessao);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);
  readonly erro = signal('');
  readonly enviando = signal(false);
  readonly formulario = inject(NonNullableFormBuilder).group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    cpf: ['', [Validators.required, Validators.pattern(/^(?:[0-9]{11}|[0-9]{3}[.][0-9]{3}[.][0-9]{3}-[0-9]{2})$/)]],
    telefone: ['', Validators.maxLength(20)],
    repetir: ['', Validators.required],
  });

  cadastrar() {
    if (this.enviando()) return;
    if (this.formulario.invalid) {
      this.erro.set('Confira seu nome, e-mail, CPF e senha. O CPF deve ter 11 dígitos.');
      return;
    }
    const { repetir, ...campos } = this.formulario.getRawValue();
    if (campos.senha !== repetir) {
      this.erro.set('As senhas precisam ser iguais.');
      return;
    }
    this.erro.set('');
    this.enviando.set(true);
    const dados = { ...campos, email: campos.email.trim() };
    this.sessao.cadastrar(dados).pipe(
      switchMap(() => this.sessao.entrar(dados.email, dados.senha)),
      finalize(() => this.enviando.set(false)),
    ).subscribe({
      next: () => {
        const voltar = this.rota.snapshot.queryParamMap.get('voltar');
        void this.router.navigateByUrl(voltar?.startsWith('/') && !voltar.startsWith('//') && !voltar.includes('\\') ? voltar : '/perfil');
      },
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível concluir o cadastro.')),
    });
  }
}
