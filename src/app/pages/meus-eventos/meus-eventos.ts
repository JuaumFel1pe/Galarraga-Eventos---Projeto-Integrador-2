import { Component } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Evento {
  id: number;
  nome: string;
  data: string;
  preco: number | null;
  ingressos: number | null;
  ativo: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-meus-eventos', standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './meus-eventos.html',
  styleUrl: './meus-eventos.css',
})

export class MeusEventos {
  ultimoId = 4;

  filtroNome = '';
  filtroData = '';
  filtroPreco: number | null = null;
  mostrarInativos = false;

  eventos: Evento[] = [
    {
      id: 1,
      nome: 'Festa de fim de ano',
      data: '31/12/2025',
      preco: 150,
      ingressos: 1000,
      ativo: true,
      editing: false
    },
    {
      id: 2,
      nome: 'Jantar Beneficente',
      data: '11/06/2025',
      preco: 280,
      ingressos: 1000,
      ativo: true,
      editing: false
    },
    {
      id: 3,
      nome: 'Laureano "El miedo"',
      data: '21/05/2025',
      preco: 167,
      ingressos: 1000,
      ativo: false,
      editing: false
    }
  ];

  eventosFiltrados: Evento[] = [...this.eventos];

  filtrar() {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const nomeOk =
        !this.filtroNome ||
        evento.nome.toLowerCase().includes(this.filtroNome.toLowerCase());

      const dataOk =
        !this.filtroData ||
        evento.data.includes(this.filtroData);

      const precoOk =
        !this.filtroPreco ||
        evento.preco === Number(this.filtroPreco);

      const ativoOk =
        this.mostrarInativos || evento.ativo;

      return nomeOk && dataOk && precoOk && ativoOk;
    });
  }

  toggleInativos() {
    this.mostrarInativos = !this.mostrarInativos;
  }

  editar(evento: Evento) {
    evento.editing = true;
  }

  salvar(evento: Evento) {
    evento.editing = false;
    this.filtrar();
  }

  excluir(id: number) {
    this.eventos = this.eventos.filter(e => e.id !== id);
    this.filtrar();
  }

  adicionarEvento() {
    const novo: Evento = {
      id: this.ultimoId++,
      nome: '',
      data: '',
      preco: null,
      ingressos: null,
      ativo: true,
      editing: true
    };

    this.eventos.unshift(novo);
    this.filtrar();
  }

  formatarPreco(valor: number | null): string {
    if (valor === null) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  trackById(index: number, item: Evento) {
    return item.id;
  }
}

