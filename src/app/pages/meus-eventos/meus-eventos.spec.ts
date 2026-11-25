import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusEventos } from './meus-eventos';

describe('MeusEventos', () => {
  let component: MeusEventos;
  let fixture: ComponentFixture<MeusEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [MeusEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(MeusEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
