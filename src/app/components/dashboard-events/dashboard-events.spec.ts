import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEventsComponent } from './dashboard-events';

describe('DashboardEvents', () => {
  let component: DashboardEventsComponent  ;
  let fixture: ComponentFixture<DashboardEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEventsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
