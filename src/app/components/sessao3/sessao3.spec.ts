import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sessao3 } from './sessao3';

describe('Sessao3', () => {
  let component: Sessao3;
  let fixture: ComponentFixture<Sessao3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sessao3],
    }).compileComponents();

    fixture = TestBed.createComponent(Sessao3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
