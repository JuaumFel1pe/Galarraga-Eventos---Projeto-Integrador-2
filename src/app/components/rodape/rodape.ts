import { Component, ChangeDetectorRef, afterNextRender, inject } from '@angular/core';
import { Configuracao, ConfiguracoesServices } from '../../services/configuracoes.services';

@Component({
  selector: 'app-rodape',
  imports: [],
  templateUrl: './rodape.html',
  styleUrl: './rodape.css',
})
export class Rodape {
  configuracoes : Configuracao | undefined
  
  constructor(private configuracoesApi : ConfiguracoesServices, private cdr: ChangeDetectorRef){
    afterNextRender(() => {
      this.buscar();
    });
  }

  buscar(){
    this.configuracoesApi.buscar().subscribe((resp) => {
      this.configuracoes = resp

      this.cdr.detectChanges();
    })
  }

  facebook() {
    window.open(this.configuracoes?.facebook, '_blank');
  }

  linkedin(){
    window.open(this.configuracoes?.linkedin, '_blank');
  }

  instagram(){
    window.open(this.configuracoes?.instagram, '_blank');
  }

  twitter(){
    window.open(this.configuracoes?.twitter, '_blank');
  }

}
