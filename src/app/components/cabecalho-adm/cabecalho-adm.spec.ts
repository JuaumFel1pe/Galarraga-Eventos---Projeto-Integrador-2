import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabecalhoAdm } from './cabecalho-adm';

describe('CabecalhoAdm', () => {
  let component: CabecalhoAdm;
  let fixture: ComponentFixture<CabecalhoAdm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [CabecalhoAdm],
    }).compileComponents();

    fixture = TestBed.createComponent(CabecalhoAdm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
