import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Evento, EventosService } from '../../services/eventos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meus-eventos', standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoAdm, MenuLateralAdm, RouterLink],
  templateUrl: './meus-eventos.html',
  styleUrl: './meus-eventos.css',
})

export class MeusEventos {
  constructor(private eventosApi: EventosService, private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.buscar();
    });
  }

  eventos: Evento[] = []
  eventosFiltrados: Evento[] = []

  buscar() {
    this.eventosApi.consultar().subscribe({
      next: (resp) => {
        this.eventos = resp;
        this.eventosFiltrados = [...this.eventos]
        
        this.cdr.detectChanges();
      }
    });
  }

  filtroNome = '';
  filtroData = '';
  filtroPreco: number | null = null;
  mostrarInativos = false;

  filtrar() {
    this.eventosFiltrados = this.eventos.filter(evento => {

      const nomeOk = 
        !this.filtroNome || 
        evento.nome.toLowerCase().includes(this.filtroNome.toLowerCase());

      const dataOk = 
        !this.filtroData || 
        (evento.dataHora && evento.dataHora.split('T')[0] === this.filtroData);

      const precoOk = 
        !this.filtroPreco || 
        Number(evento.preco) <= Number(this.filtroPreco);

      const ativoOk = this.mostrarInativos ? evento.inativo === true : !evento.inativo;

      return nomeOk && dataOk && precoOk && ativoOk;
    });
  }

  toggleInativos() {
    this.mostrarInativos = !this.mostrarInativos;

    this.filtrar(); 
  }

  excluir(id: number) {
    this.eventosApi.remover(id).subscribe(() => {
      alert("Evento deletado com sucesso")
      this.buscar()
    })
  }


  formatarPreco(valor: number | null): string {
    if (valor === null) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  trackById(index: number, item: Evento) {
    return item.id;
  }
}

