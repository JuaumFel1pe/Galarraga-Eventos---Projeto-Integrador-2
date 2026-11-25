import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Api, erroApi, moeda } from '../../core/api';
import { Venda } from '../../core/modelos';

@Component({
  selector: 'app-vendas', imports: [CabecalhoAdm, MenuLateralAdm, FormsModule, DatePipe],
  templateUrl: './vendas.html',
})
export class Vendas {
  private readonly api = inject(Api);
  readonly vendas = signal<Venda[]>([]);
  readonly erro = signal('');
  readonly erroCheckIn = signal('');
  readonly sucesso = signal('');
  readonly validando = signal(false);
  readonly carregando = signal(true);
  readonly cancelando = signal<number | null>(null);
  readonly moeda = moeda;
  codigo = '';

  ngOnInit() { this.buscar(); }

  buscar() {
    this.carregando.set(true);
    this.api.vendas().pipe(finalize(() => this.carregando.set(false))).subscribe({
      next: vendas => this.vendas.set(vendas),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível listar as vendas.')),
    });
  }

  validar() {
    if (this.validando() || !this.codigo.trim()) return;
    this.validando.set(true);
    this.erroCheckIn.set('');
    this.sucesso.set('');
    this.api.checkIn(this.codigo.trim()).pipe(finalize(() => this.validando.set(false))).subscribe({
      next: ingresso => {
        this.sucesso.set('Check-in registrado para o ingresso #' + ingresso.id + '.');
        this.codigo = '';
        this.buscar();
      },
      error: erro => this.erroCheckIn.set(erroApi(erro, 'Não foi possível validar o ingresso.')),
    });
  }

  cancelar(venda: Venda) {
    if (this.cancelando() !== null || !window.confirm('Cancelar o pedido #' + venda.id + '?')) return;
    this.cancelando.set(venda.id);
    this.erro.set('');
    this.api.cancelar(venda.id).pipe(finalize(() => this.cancelando.set(null))).subscribe({
      next: pedido => this.vendas.update(vendas => vendas.map(item => item.id === pedido.id
        ? { ...item, status: pedido.status, cancelavel: false } : item)),
      error: erro => this.erro.set(erroApi(erro, 'Não foi possível cancelar o pedido.')),
    });
  }
}
