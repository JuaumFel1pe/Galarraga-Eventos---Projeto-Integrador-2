import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosDisponiveis } from './eventos-disponiveis';

describe('EventosDisponiveis', () => {
  let component: EventosDisponiveis;
  let fixture: ComponentFixture<EventosDisponiveis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
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
