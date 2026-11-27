import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Cabecalho } from './cabecalho';

describe('Cabecalho', () => {
  let component: Cabecalho;
  let fixture: ComponentFixture<Cabecalho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cabecalho],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Cabecalho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides on downward scroll and shows on upward scroll', () => {
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    const host: HTMLElement = fixture.nativeElement;

    try {
      expect(host.classList.contains('oculto')).toBe(false);

      scrollY.mockReturnValue(200);
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
});
