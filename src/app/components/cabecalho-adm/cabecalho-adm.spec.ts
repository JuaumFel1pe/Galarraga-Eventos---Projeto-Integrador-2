import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabecalhoAdm } from './cabecalho-adm';

describe('CabecalhoAdm', () => {
  let component: CabecalhoAdm;
  let fixture: ComponentFixture<CabecalhoAdm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
