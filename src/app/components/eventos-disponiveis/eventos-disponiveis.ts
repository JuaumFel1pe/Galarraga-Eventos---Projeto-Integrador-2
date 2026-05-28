import { afterNextRender, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventoModel, EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-eventos-disponiveis',
  imports: [RouterLink],
  templateUrl: './eventos-disponiveis.html',
  styleUrl: './eventos-disponiveis.css',
})
export class EventosDisponiveis {

  evento: EventoModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.eventosService.consultarAtivos().subscribe((res) => {
        this.evento = res;
        this.cdr.detectChanges();
      });

    });
  }

}

