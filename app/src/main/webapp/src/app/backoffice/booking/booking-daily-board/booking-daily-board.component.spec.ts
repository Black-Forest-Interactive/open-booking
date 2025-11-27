import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDailyBoardComponent } from './booking-daily-board.component';

describe('BookingDailyBoardComponent', () => {
  let component: BookingDailyBoardComponent;
  let fixture: ComponentFixture<BookingDailyBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDailyBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDailyBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
