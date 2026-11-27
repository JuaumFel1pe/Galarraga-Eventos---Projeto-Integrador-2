import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-cabecalho',
  imports: [RouterLink],
  templateUrl: './cabecalho.html',
  styleUrl: './cabecalho.css',
  host: { '[class.oculto]': 'oculto()' },
})
export class Cabecalho {
  readonly sessao = inject(LoginService);
  private readonly router = inject(Router);
  protected readonly oculto = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let ultimaPosicao = Math.max(0, window.scrollY);
      const atualizarVisibilidade = () => {
        const posicao = Math.max(0, window.scrollY);

        if (posicao !== ultimaPosicao) {
          this.oculto.set(posicao > ultimaPosicao);
          ultimaPosicao = posicao;
        }
      };

      window.addEventListener('scroll', atualizarVisibilidade, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', atualizarVisibilidade));
    });
  }

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
