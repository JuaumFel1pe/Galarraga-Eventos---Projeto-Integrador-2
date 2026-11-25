import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Api, erroApi, moeda, RecursoCatalogo } from '../../core/api';
import { Categoria, Evento, LocalEvento, TipoIngresso } from '../../core/modelos';

type Aba = Exclude<RecursoCatalogo, 'eventos'>;
const categoriaVazia = { nome: '', descricao: '' };
const localVazio = { nome: '', endereco: '', cidade: '', estado: 'SP', capacidade: 1 };

@Component({
  selector: 'app-catalogo-admin', imports: [FormsModule, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './catalogo-admin.html',
})
export class CatalogoAdmin {
  private readonly api = inject(Api);
  private readonly rota = inject(ActivatedRoute);
  readonly filtroEvento = signal(Number(this.rota.snapshot.queryParamMap.get('evento')) || 0);
  readonly aba = signal<Aba>(this.filtroEvento() ? 'tipos-ingresso' : 'categorias');
  readonly categorias = signal<Categoria[]>([]);
  readonly locais = signal<LocalEvento[]>([]);
  readonly tipos = signal<TipoIngresso[]>([]);
  readonly eventos = signal<Evento[]>([]);
  readonly tiposFiltrados = computed(() => this.tipos().filter(tipo => !this.filtroEvento() || this.filtroEvento() === tipo.idEvento));
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly carregando = signal(true);
  readonly processando = signal(false);
  readonly moeda = moeda;
  id?: number;
  categoria = { ...categoriaVazia };
  local = { ...localVazio };
  tipo = { idEvento: this.filtroEvento(), nome: '', preco: 0, quantidadeTotal: 1 };

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.api.catalogo().pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: ({ eventos, categorias, locais, tipos }) => {
        this.eventos.set(eventos); this.categorias.set(categorias); this.locais.set(locais); this.tipos.set(tipos);
      },
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar o catálogo.')),
    });
  }

  selecionar(aba: Aba) {
    this.aba.set(aba);
    this.erro.set('');
    this.sucesso.set('');
    this.limpar();
  }

  limpar() {
    this.id = undefined;
    this.categoria = { ...categoriaVazia };
    this.local = { ...localVazio };
    this.tipo = { idEvento: this.filtroEvento(), nome: '', preco: 0, quantidadeTotal: 1 };
  }

  editarCategoria(item: Categoria) {
    this.id = item.id;
    this.categoria = { nome: item.nome, descricao: item.descricao ?? '' };
  }

  editarLocal(item: LocalEvento) {
    const { id, ...campos } = item;
    this.id = id;
    this.local = campos;
  }

  editarTipo(item: TipoIngresso) {
    const { id, idEvento, nome, preco, quantidadeTotal } = item;
    this.id = id;
    this.tipo = { idEvento, nome, preco, quantidadeTotal };
  }

  nomeEvento(id: number) { return this.eventos().find(evento => evento.id === id)?.titulo ?? 'Evento #' + id; }

  salvar() {
    if (this.processando()) return;
    const aba = this.aba();
    if (aba === 'tipos-ingresso' && !this.tipo.idEvento) return;
    this.iniciarOperacao();
    const pedido: Observable<Categoria | LocalEvento | TipoIngresso> = aba === 'categorias' ? this.api.salvar<Categoria>(aba, this.categoria, this.id)
      : aba === 'locais' ? this.api.salvar<LocalEvento>(aba, this.local, this.id)
      : this.api.salvarTipo(this.tipo, this.id);
    pedido.pipe(finalize(() => this.processando.set(false))).subscribe({
      next: () => { this.sucesso.set('Cadastro salvo.'); this.limpar(); this.carregar(); },
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível salvar o cadastro.')),
    });
  }

  excluir(id: number, nome: string) {
    if (this.processando() || !window.confirm('Excluir ' + nome + '?')) return;
    this.iniciarOperacao();
    this.api.excluir(this.aba(), id).pipe(finalize(() => this.processando.set(false))).subscribe({
      next: () => { this.sucesso.set('Cadastro excluído.'); if (this.id === id) this.limpar(); this.carregar(); },
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível excluir o cadastro.')),
    });
  }

  private iniciarOperacao() {
    this.erro.set('');
    this.sucesso.set('');
    this.processando.set(true);
  }
}
