import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosDisponiveis } from './eventos-disponiveis';

describe('EventosDisponiveis', () => {
  let component: EventosDisponiveis;
  let fixture: ComponentFixture<EventosDisponiveis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosDisponiveis],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosDisponiveis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
