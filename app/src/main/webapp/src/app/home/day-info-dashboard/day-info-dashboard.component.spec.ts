import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDashboardComponent} from './day-info-dashboard.component';

describe('DayInfoDashboardComponent', () => {
  let component: DayInfoDashboardComponent;
  let fixture: ComponentFixture<DayInfoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
