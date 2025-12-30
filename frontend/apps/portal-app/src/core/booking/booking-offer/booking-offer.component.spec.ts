import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingOfferComponent } from './booking-offer.component';

describe('BookingOfferComponent', () => {
  let component: BookingOfferComponent;
  let fixture: ComponentFixture<BookingOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
