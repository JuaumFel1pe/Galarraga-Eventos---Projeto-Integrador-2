import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLateralAdm } from './menu-lateral-adm';

describe('MenuLateralAdm', () => {
  let component: MenuLateralAdm;
  let fixture: ComponentFixture<MenuLateralAdm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      imports: [MenuLateralAdm],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuLateralAdm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
