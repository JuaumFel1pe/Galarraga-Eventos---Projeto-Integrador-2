import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cabecalho } from './cabecalho';

describe('Cabecalho', () => {
  let component: Cabecalho;
  let fixture: ComponentFixture<Cabecalho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [Cabecalho],
    }).compileComponents();

    fixture = TestBed.createComponent(Cabecalho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides while scrolling down and reappears while scrolling up', () => {
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(200);
    const host: HTMLElement = fixture.nativeElement;

    try {
      expect(host.classList.contains('oculto')).toBe(false);
      window.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(host.classList.contains('oculto')).toBe(true);

      scrollY.mockReturnValue(150);
      window.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(host.classList.contains('oculto')).toBe(false);
    } finally {
      scrollY.mockRestore();
    }
  });

  it('keeps public, account and admin links and allows signing out', () => {
    const host: HTMLElement = fixture.nativeElement;
    const links = () => Array.from(host.querySelectorAll('nav a'), link => link.getAttribute('href'));
    expect(links()).toEqual(['/', '/#eventos', '/cadastro', '/login']);

    const perfil = {
      id: 1,
      nome: 'Pessoa Teste',
      email: 'teste@example.com',
      cpf: '',
      telefone: null,
      dataCadastro: '',
      ativo: true,
    };
    const http = TestBed.inject(HttpTestingController);
    component.sessao.carregarPerfil().subscribe();
    http.expectOne('/api/usuarios/me').flush({ ...perfil, role: 'USER' });
    fixture.detectChanges();
    expect(links()).toEqual(['/', '/#eventos', '/perfil']);

    component.sessao.carregarPerfil().subscribe();
    http.expectOne('/api/usuarios/me').flush({ ...perfil, role: 'ADMIN' });
    fixture.detectChanges();
    expect(links()).toEqual(['/', '/#eventos', '/dashboardadm', '/perfil']);

    const navegar = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    try {
      host.querySelector<HTMLButtonElement>('button.sair')!.click();
      fixture.detectChanges();
      expect(navegar).toHaveBeenCalledWith('/');
      expect(links()).toEqual(['/', '/#eventos', '/cadastro', '/login']);
    } finally {
      navegar.mockRestore();
    }
  });
});
