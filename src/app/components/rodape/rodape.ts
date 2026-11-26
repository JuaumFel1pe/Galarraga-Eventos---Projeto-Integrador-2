import { Component, inject, signal } from '@angular/core';
import { Configuracao, ConfiguracoesServices } from '../../services/configuracoes.services';

@Component({ selector: 'app-rodape', templateUrl: './rodape.html', styleUrl: './rodape.css' })
export class Rodape {
  readonly dados = signal<Configuracao | null>(null);
  private readonly configuracoesService = inject(ConfiguracoesServices);

  ngOnInit() {
    this.configuracoesService.buscar().subscribe({ next: dados => this.dados.set(dados), error: () => undefined });
  }
}
