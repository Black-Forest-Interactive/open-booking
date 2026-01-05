import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReservationOfferComponent} from './reservation-offer.component';

describe('BookingOfferComponent', () => {
  let component: ReservationOfferComponent;
  let fixture: ComponentFixture<ReservationOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationOfferComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
