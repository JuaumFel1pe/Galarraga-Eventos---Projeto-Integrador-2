import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarEvento } from './alterar-evento';

describe('AlterarEvento', () => {
  let component: AlterarEvento;
  let fixture: ComponentFixture<AlterarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
