import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoBookingSelectionComponent} from './day-info-booking-selection.component';

describe('DayInfoBookingSelectionComponent', () => {
  let component: DayInfoBookingSelectionComponent;
  let fixture: ComponentFixture<DayInfoBookingSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoBookingSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoBookingSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
