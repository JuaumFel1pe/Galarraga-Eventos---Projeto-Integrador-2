import { Component, ChangeDetectorRef, afterNextRender, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CabecalhoAdm } from '../../components/cabecalho-adm/cabecalho-adm';
import { MenuLateralAdm } from '../../components/menu-lateral-adm/menu-lateral-adm';
import { Configuracao, ConfiguracoesServices } from '../../services/configuracoes.services';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CabecalhoAdm, MenuLateralAdm, ReactiveFormsModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes {
  
  configuracoes: Configuracao | undefined;
  private fb = inject(NonNullableFormBuilder);

  configForm = this.fb.group({
    endereco: ['', Validators.required],
    email: ['', Validators.required],
    telefone: ['', Validators.required],
    facebook: ['', Validators.required],
    instagram: ['', Validators.required],
    linkedin: ['', Validators.required],
    twitter: ['', Validators.required]
  });

  constructor(private configuracoesApi: ConfiguracoesServices, private cdr: ChangeDetectorRef) {
    afterNextRender(() => {
      this.buscarPreencher();
    });
  }

  buscarPreencher() {
    this.configuracoesApi.buscar().subscribe((resp) => {
      this.configuracoes = resp;

      this.configForm.patchValue({
        endereco: resp.endereco,
        email: resp.email,
        telefone: resp.telefone,
        facebook: resp.facebook,
        instagram: resp.instagram,
        linkedin: resp.linkedin,
        twitter: resp.twitter
      });

      this.cdr.detectChanges();
    });
  }

  salvar() {
    if (this.configForm.valid) {
      const dadosAtualizados: Configuracao = this.configForm.getRawValue();

      this.configuracoesApi.atualizar(dadosAtualizados).subscribe(() => {
        alert("Configurações alteradas com sucesso!");
        this.buscarPreencher()
      });
      
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  }
}