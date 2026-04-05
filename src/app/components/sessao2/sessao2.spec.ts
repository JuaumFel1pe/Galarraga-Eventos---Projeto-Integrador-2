import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sessao2 } from './sessao2';

describe('Sessao2', () => {
  let component: Sessao2;
  let fixture: ComponentFixture<Sessao2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sessao2],
    }).compileComponents();

    fixture = TestBed.createComponent(Sessao2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
