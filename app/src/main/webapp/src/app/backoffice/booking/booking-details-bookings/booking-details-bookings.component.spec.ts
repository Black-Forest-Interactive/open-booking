import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsBookingsComponent } from './booking-details-bookings.component';

describe('BookingDetailsBookingsComponent', () => {
  let component: BookingDetailsBookingsComponent;
  let fixture: ComponentFixture<BookingDetailsBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDetailsBookingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
