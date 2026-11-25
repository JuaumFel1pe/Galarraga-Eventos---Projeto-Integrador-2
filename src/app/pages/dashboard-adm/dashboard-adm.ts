import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { finalize, forkJoin } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Api, erroApi, moeda } from '../../core/api';
import { Venda } from '../../core/modelos';

@Component({
  selector: 'app-dashboard-adm', imports: [BaseChartDirective, CabecalhoAdm, MenuLateralAdm, RouterLink],
  templateUrl: './dashboard-adm.html', styleUrl: './dashboard-adm.css',
})
export class DashboardAdm {
  private readonly api = inject(Api);
  readonly dados = signal<{ ativos: number; estoque: number; vendas: Venda[] } | null>(null);
  readonly erro = signal('');
  readonly carregando = signal(true);
  readonly moeda = moeda;
  readonly confirmadas = computed(() => this.dados()?.vendas.filter(venda => venda.status === 'CONFIRMADO') ?? []);
  readonly receita = computed(() => this.confirmadas().reduce((total, venda) => total + venda.valorTotal, 0));
  readonly vendidos = computed(() => this.confirmadas().reduce((total, venda) => total + venda.quantidade, 0));
  readonly grafico = computed<ChartConfiguration<'bar'>['data']>(() => {
    const dias = new Map<string, number>();
    for (const venda of this.confirmadas()) {
      const data = venda.dataPedido.slice(0, 10);
      dias.set(data, (dias.get(data) ?? 0) + venda.valorTotal);
    }
    const recentes = [...dias].sort(([a], [b]) => a.localeCompare(b)).slice(-7);
    return {
      labels: recentes.map(([data]) => data.split('-').reverse().join('/')),
      datasets: [{ label: 'Vendas simuladas (R$)', data: recentes.map(([, total]) => total), backgroundColor: '#79469a', borderRadius: 8 }],
    };
  });
  readonly opcoes: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } },
  };

  ngOnInit() {
    forkJoin({ eventos: this.api.eventos(), vendas: this.api.vendas(), tipos: this.api.tipos() })
      .pipe(finalize(() => this.carregando.set(false))).subscribe({
        next: ({ eventos, vendas, tipos }) => {
          const ativos = new Set(eventos.filter(evento =>
            evento.status === 'ATIVO' && new Date(evento.dataFim).getTime() > Date.now()).map(evento => evento.id));
          const estoque = tipos.filter(tipo => ativos.has(tipo.idEvento))
            .reduce((total, tipo) => total + tipo.quantidadeDisponivel, 0);
          this.dados.set({ ativos: ativos.size, estoque, vendas });
        },
        error: erro => this.erro.set(erroApi(erro, 'Não foi possível carregar o painel.')),
      });
  }
}
