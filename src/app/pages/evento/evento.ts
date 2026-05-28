import { Component, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { Cabecalho } from '../../components/cabecalho/cabecalho';
import { Rodape } from '../../components/rodape/rodape';
import { ActivatedRoute } from '@angular/router';
import { EventosService, EventoModel } from '../../services/eventos.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-evento',
  imports: [Cabecalho, Rodape, CommonModule],
  templateUrl: './evento.html',
  styleUrl: './evento.css',
})
export class Evento {

  evento?: EventoModel;

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));

      if (!id) return;

      this.eventosService.consultarId(id).subscribe((res) => {
        this.evento = res;
        this.cdr.detectChanges();
        console.log(this.evento)
      });

    });
  }

formatarParaDate(data: string): string {
  if (!data) return '';

  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

 formatarPreco(preco: number | null | undefined): string {
  if (preco == null) return '';

  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
}