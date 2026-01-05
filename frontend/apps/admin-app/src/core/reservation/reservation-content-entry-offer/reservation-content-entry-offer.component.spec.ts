import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationContentEntryOfferComponent } from './reservation-content-entry-offer.component';

describe('ReservationContentEntryOfferComponent', () => {
  let component: ReservationContentEntryOfferComponent;
  let fixture: ComponentFixture<ReservationContentEntryOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationContentEntryOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationContentEntryOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
