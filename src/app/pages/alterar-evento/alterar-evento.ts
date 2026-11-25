import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, of } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Api, erroApi } from '../../core/api';
import { Categoria, Evento, LocalEvento } from '../../core/modelos';

@Component({
  selector: 'app-alterar-evento', imports: [FormsModule, RouterLink, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './alterar-evento.html',
})
export class AlterarEvento {
  private readonly api = inject(Api);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly idSelecionado = Number(this.rota.snapshot.paramMap.get('id')) || undefined;
  readonly locais = signal<LocalEvento[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly carregando = signal(true);
  readonly enviando = signal(false);
  readonly erro = signal('');
  evento: Omit<Evento, 'id'> = {
    idLocal: 0, idCategoria: 0, titulo: '', descricao: '', bannerUrl: '',
    dataInicio: '', dataFim: '', status: 'ATIVO',
  };

  ngOnInit() {
    forkJoin({ locais: this.api.locais(), categorias: this.api.categorias(),
      evento: this.idSelecionado ? this.api.evento(this.idSelecionado) : of(null) })
      .pipe(finalize(() => this.carregando.set(false))).subscribe({
        next: ({ locais, categorias, evento }) => {
          this.locais.set(locais);
          this.categorias.set(categorias);
          if (evento) {
            const { id, ...campos } = evento;
            this.evento = { ...campos, dataInicio: campos.dataInicio.slice(0, 16), dataFim: campos.dataFim.slice(0, 16) };
          }
        },
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar o formulário de eventos.')),
      });
  }

  salvarEvento() {
    if (this.enviando()) return;
    if (this.evento.dataFim <= this.evento.dataInicio) {
      this.erro.set('O fim deve ser posterior ao início do evento.');
      return;
    }
    this.enviando.set(true);
    this.erro.set('');
    this.api.salvar<Evento>('eventos', this.evento, this.idSelecionado)
      .pipe(finalize(() => this.enviando.set(false))).subscribe({
        next: () => void this.router.navigateByUrl('/meus-eventos'),
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível salvar o evento.')),
      });
  }
}
