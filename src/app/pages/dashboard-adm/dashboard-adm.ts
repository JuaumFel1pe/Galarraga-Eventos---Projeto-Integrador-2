import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Venda, VendasService } from '../../services/vendas.service';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../evento/evento';

@Component({
  selector: 'app-dashboard-adm',
  imports: [BaseChartDirective, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './dashboard-adm.html',
  styleUrl: './dashboard-adm.css',
})
export class DashboardAdm {
  vendas : Venda[] = []
  eventos : Evento[] = []

  dashboard = {
    receita : 0,
    ingressosVendidos : 0,
    eventosAtivos : 0
  }

  constructor(private vendasApi : VendasService, private eventosApi : EventosService, private cdr: ChangeDetectorRef){
    afterNextRender(() => {
      this.informacoes();
    }); //Vai mostrar as informações mesmo depois de tudo já ter sido renderizado no html
  } //cdr serve para aplicar as mudanças no html que foram calculadas dps de serem renderizadas no html

  buscarEventosAtivos(){
    this.eventosApi.consultarAtivos().subscribe(resp => this.eventos = resp)
  }

  buscarVendas(){
    this.vendasApi.consultar().subscribe(resp => this.vendas = resp)
  }

  informacoes() {
    // O forkjoin serve para disparar as duas requisições e só fazer todos os cálculos quando tiver retorno das duas requisições
    forkJoin({
      eventosResp: this.eventosApi.consultarAtivos(),
      vendasResp: this.vendasApi.consultar()
    }).subscribe({
      next: (resp) => {
        // Só executa quando os dois endpoints já responderam com sucesso
        this.eventos = resp.eventosResp;
        this.vendas = resp.vendasResp;

        console.log("Primeiro evento carregado:", this.vendas[0]);

        // Agora é possível realizar os cálculos necessários
        this.dashboard.eventosAtivos = this.eventos.length;
        this.dashboard.ingressosVendidos = this.vendas.length;

        this.dashboard.receita = 0; 
        for(let i = 0; i < this.vendas.length; i++) {
          this.dashboard.receita += this.vendas[i].valor;
        }

        this.cdr.detectChanges(); //Avisa ao angular que já pode mostrar os novos valores no html
      },
      error: (erro) => {
        console.error("Erro nas APIs:", erro);
        alert("Erro ao carregar informações da Dashboard do Administrador");
      }
    });
  }

  formatarPreco(valor: number | null): string {
    if (valor === null) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  graficoGastosTipo: 'bar' = 'bar';

  graficoGastosData: ChartConfiguration<'bar'>['data'] = {
    labels: ['', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        label: 'Valores',
        data: [340, 240, 120, 300, 520, 430, 500, 300, 170],
        backgroundColor: '#f3ebff',
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 6
      }
    ]
  };

  graficoOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#ffffff'
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        max: 600,
        ticks: {
          color: '#ffffff',
          stepSize: 100
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    }
  };
}
