import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReservationCheckoutComponent} from './reservation-checkout.component';

describe('BookingCheckoutComponent', () => {
  let component: ReservationCheckoutComponent;
  let fixture: ComponentFixture<ReservationCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCheckoutComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
