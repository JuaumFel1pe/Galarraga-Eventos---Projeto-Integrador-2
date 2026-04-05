import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sessao6 } from './sessao6';

describe('Sessao6', () => {
  let component: Sessao6;
  let fixture: ComponentFixture<Sessao6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sessao6],
    }).compileComponents();

    fixture = TestBed.createComponent(Sessao6);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
