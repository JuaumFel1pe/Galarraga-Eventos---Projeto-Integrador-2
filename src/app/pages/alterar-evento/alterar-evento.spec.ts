import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarEvento } from './alterar-evento';

describe('AlterarEvento', () => {
  let component: AlterarEvento;
  let fixture: ComponentFixture<AlterarEvento>;
  let http: HttpTestingController;

  beforeEach(async () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date(2030, 0, 15, 14, 30, 30).getTime());
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [AlterarEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(AlterarEvento);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('/api/locais').flush([{ id: 1, nome: 'Salão' }]);
    http.expectOne('/api/categorias').flush([{ id: 1, nome: 'Festa' }]);
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    http.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('aplica o limite no horário local aos dois campos e o atualiza ao focar', () => {
    const campos = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('input[type="datetime-local"]');
    expect(Array.from(campos, campo => campo.min)).toEqual(['2030-01-15T14:31', '2030-01-15T14:31']);

    vi.mocked(Date.now).mockReturnValue(new Date(2030, 0, 15, 14, 31, 30).getTime());
    campos[0].dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(Array.from(campos, campo => campo.min)).toEqual(['2030-01-15T14:32', '2030-01-15T14:32']);
  });

  it('bloqueia o envio se o início passou enquanto o formulário estava aberto', () => {
    component.evento.dataInicio = '2030-01-15T14:31';
    component.evento.dataFim = '2030-01-15T14:32';
    vi.mocked(Date.now).mockReturnValue(new Date(2030, 0, 15, 14, 31, 30).getTime());

    component.salvarEvento();

    expect(component.erro()).toContain('horário atual');
    http.expectNone('/api/eventos');
  });

  it('bloqueia o envio se o fim estiver no passado', () => {
    component.evento.dataInicio = '2030-01-15T14:31';
    component.evento.dataFim = '2030-01-15T14:30';

    component.salvarEvento();

    expect(component.erro()).toContain('horário atual');
    http.expectNone('/api/eventos');
  });

  it('exige que o fim seja posterior ao início', () => {
    component.evento.dataInicio = '2030-01-15T14:31';
    component.evento.dataFim = '2030-01-15T14:31';

    component.salvarEvento();

    expect(component.erro()).toBe('O fim deve ser posterior ao início do evento.');
    http.expectNone('/api/eventos');
  });

  it('envia o evento quando as datas são válidas', () => {
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    component.evento.dataInicio = '2030-01-15T14:31';
    component.evento.dataFim = '2030-01-15T14:32';

    component.salvarEvento();

    const requisicao = http.expectOne({ method: 'POST', url: '/api/eventos' });
    expect(requisicao.request.body).toMatchObject({ dataInicio: '2030-01-15T14:31', dataFim: '2030-01-15T14:32' });
    requisicao.flush({ id: 1, ...component.evento });
    expect(component.erro()).toBe('');
  });
});
