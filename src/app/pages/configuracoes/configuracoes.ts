import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';


import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';

@Component({
  selector: 'app-configuracoes',
  imports: [CabecalhoAdm, MenuLateralAdm, ReactiveFormsModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {
  //Usando o FormBuilder para criar o formulário (NonNullable justamente para não permitir valores nulos)
  private fb = inject(NonNullableFormBuilder);

  configForm = this.fb.group({
    endereco: [''],
    telefone: [''],
    facebook: [''],
    instagram: [''],
    linkedin: [''],
    twitter: ['']
  })

  salvarConfig(){
    console.log("Dados do formulário: ", this.configForm.value)
    //Simulação para salvar o formulário
  }
}
