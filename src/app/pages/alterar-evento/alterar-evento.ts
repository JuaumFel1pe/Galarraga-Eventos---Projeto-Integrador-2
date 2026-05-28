import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { EventosService, Evento } from '../../services/eventos.service';

@Component({
  selector: 'app-alterar-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoAdm, MenuLateralAdm],
  templateUrl: './alterar-evento.html',
  styleUrls: ['./alterar-evento.css']
})
export class AlterarEvento {
  idSelecionado: number | null = null;

  evento = {
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
    private eventoApi: EventosService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef 
  ) {
    afterNextRender(() => {
      this.verificarModoEdicao();
    });
  }

  verificarModoEdicao() {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      this.idSelecionado = parseInt(id);

      this.eventoApi.consultarId(this.idSelecionado).subscribe({
        next: (resp) => {
          this.preencherFormulario(resp);
          
          this.cdr.detectChanges(); 
        },
        error: (error) => {
          alert("Evento não encontrado!");
          this.router.navigate(["/meus-eventos"]);
        }
      });
    }
  }

  preencherFormulario(evento: Evento): void {

    this.evento.urlImg = evento.urlImg;
    this.evento.nome = evento.nome;
    this.evento.endereco = evento.endereco;
    this.evento.preco = evento.preco;
    this.evento.qtd = evento.qtd;
    this.evento.inativo = evento.inativo;
    this.evento.descricao = evento.descricao;
    this.evento.destaque = evento.destaque;
    
    this.evento.dataHora = evento.dataHora ? evento.dataHora.split('T')[0] : '';

    console.log(this.evento.urlImg)
  }

  salvarEvento(): void {
    const dadosFinais = {
      ...this.evento
    };

    if (this.idSelecionado) {
      const dadosParaAtualizar: Evento = {
        id: this.idSelecionado,
        ...dadosFinais
      };

      this.eventoApi.editar(dadosParaAtualizar).subscribe(() => {
        alert("Evento atualizado com sucesso!");
        this.router.navigate(['/meus-eventos']);
      });
    } else {
      this.eventoApi.salvar(dadosFinais as Evento).subscribe(() => {
        alert("Evento adicionado com sucesso!");
        this.router.navigate(['/meus-eventos']);
      });
    }
  }
}