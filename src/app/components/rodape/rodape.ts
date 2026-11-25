import { Component, inject, signal } from '@angular/core';
import { Api } from '../../core/api';
import { Configuracao } from '../../core/modelos';

@Component({ selector: 'app-rodape', templateUrl: './rodape.html', styleUrl: './rodape.css' })
export class Rodape {
  readonly dados = signal<Configuracao | null>(null);
  private readonly api = inject(Api);

  ngOnInit() {
    this.api.configuracao().subscribe({ next: dados => this.dados.set(dados), error: () => undefined });
  }
}
