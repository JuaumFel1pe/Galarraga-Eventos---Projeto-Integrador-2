import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
})
export class Cabecalho {
  readonly sessao = inject(LoginService);
  private readonly router = inject(Router);

  ngOnInit() {
    if (this.sessao.token() && !this.sessao.usuario()) {
      this.sessao.carregarPerfil().subscribe({ error: () => undefined });
    }
  }

  sair() {
    this.sessao.sair();
    void this.router.navigateByUrl('/');
  }
}
