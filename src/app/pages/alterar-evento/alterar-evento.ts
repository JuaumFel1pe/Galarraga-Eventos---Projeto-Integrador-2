import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-alterar-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alterar-evento.html',
  styleUrls: ['./alterar-evento.css']
})
export class AlterarEvento {

  evento = {
    urlImagem: '',
    titulo: '',
    endereco: '',
    dataHora: '',
    preco: '',
    qtdIngressos: '',
    inativar: false,
    descricao: ''
  };

  salvarEvento() {
    console.log('Dados do formulário:', this.evento);
    alert('Salvando evento: ' + this.evento.titulo);
  }
}