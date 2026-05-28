import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { EventoModel, EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-alterar-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './alterar-evento.html',
  styleUrls: ['./alterar-evento.css']
})
export class AlterarEvento {

  idSelecionado: number | null = null;

  evento: EventoModel = {
    id: 0,
    urlImg: '',
    nome: '',
    endereco: '',
    dataHora: '',
    preco: 0,
    qtd: 0,
    inativo: false,
    descricao: '',
    destaque: false
  };

  constructor(
    private eventoApi: EventosService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.verificarModoEdicao();
    });
  }

  verificarModoEdicao() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idSelecionado = Number(id);

      this.eventoApi.consultarId(this.idSelecionado).subscribe({
        next: (resp) => {
          this.preencherFormulario(resp);
          this.cdr.detectChanges();
        },
        error: () => {
          alert("Evento não encontrado!");
          this.router.navigate(["/meus-eventos"]);
        }
      });
    }
  }

  preencherFormulario(evento: EventoModel): void {
    this.evento = {
      ...evento,
      dataHora: evento.dataHora ? evento.dataHora.split('T')[0] : ''
    };
  }

  salvarEvento(): void {

    if (this.idSelecionado) {

      const dadosAtualizados: EventoModel = {
        ...this.evento,
        id: this.idSelecionado
      };

      this.eventoApi.editar(dadosAtualizados).subscribe(() => {
        alert("Evento atualizado com sucesso!");
        this.router.navigate(['/meus-eventos']);
      });

    } else {

      this.eventoApi.salvar(this.evento).subscribe(() => {
        alert("Evento adicionado com sucesso!");
        this.router.navigate(['/meus-eventos']);
      });

    }
  }
}