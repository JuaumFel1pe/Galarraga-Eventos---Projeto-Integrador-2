import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-events',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard-events.html',
  styleUrl: './dashboard-events.css',
})
export class DashboardEventsComponent {
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