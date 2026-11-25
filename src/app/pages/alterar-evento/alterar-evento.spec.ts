import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarEvento } from './alterar-evento';

describe('AlterarEvento', () => {
  let component: AlterarEvento;
  let fixture: ComponentFixture<AlterarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [AlterarEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(AlterarEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
