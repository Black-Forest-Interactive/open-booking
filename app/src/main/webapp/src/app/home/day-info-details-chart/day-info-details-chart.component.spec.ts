import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDetailsChartComponent} from './day-info-details-chart.component';

describe('DayInfoDetailsChartComponent', () => {
  let component: DayInfoDetailsChartComponent;
  let fixture: ComponentFixture<DayInfoDetailsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDetailsChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDetailsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
