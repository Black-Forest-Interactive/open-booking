import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDailyBoardOfferComponent } from './booking-daily-board-offer.component';

describe('BookingDailyBoardOfferComponent', () => {
  let component: BookingDailyBoardOfferComponent;
  let fixture: ComponentFixture<BookingDailyBoardOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDailyBoardOfferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDailyBoardOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
