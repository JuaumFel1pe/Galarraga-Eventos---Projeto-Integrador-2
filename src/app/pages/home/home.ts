import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
 
  eventos = [
    {
      titulo: 'Casamentos',
      descricao: 'Planejamento completo para o seu grande dia.',
      imagem: 'images/casamento.jpg'
    },
    {
      titulo: 'Corporativos',
      descricao: 'Eventos empresariais com foco em resultados.',
      imagem: 'images/corporativo.jpg'
    },
    {
      titulo: 'Festas e Aniversários',
      descricao: 'Comemorações inesquecíveis para todas as idades.',
      imagem: 'images/festa.jpg'
    }
  ];
}