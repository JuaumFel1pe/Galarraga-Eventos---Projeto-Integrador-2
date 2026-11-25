import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Api, erroApi } from '../../core/api';
import { Configuracao } from '../../core/modelos';

@Component({
  selector: 'app-configuracoes', imports: [CabecalhoAdm, MenuLateralAdm, FormsModule],
  templateUrl: './configuracoes.html',
})
export class Configuracoes {
  private readonly api = inject(Api);
  readonly dados = signal<Configuracao | null>(null);
  readonly erro = signal('');
  readonly salvo = signal(false);
  readonly enviando = signal(false);

  ngOnInit() {
    this.api.configuracao().subscribe({
      next: config => this.dados.set(config),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar as configurações.')),
    });
  }

  salvar(config: Configuracao) {
    if (this.enviando()) return;
    this.erro.set('');
    this.salvo.set(false);
    this.enviando.set(true);
    this.api.salvarConfiguracao(config).pipe(finalize(() => this.enviando.set(false))).subscribe({
      next: atualizado => { this.dados.set(atualizado); this.salvo.set(true); },
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível salvar as configurações.')),
    });
  }
}
