import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDashboardEntryComponent} from './day-info-dashboard-entry.component';

describe('DayInfoDashboardEntryComponent', () => {
  let component: DayInfoDashboardEntryComponent;
  let fixture: ComponentFixture<DayInfoDashboardEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDashboardEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDashboardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
