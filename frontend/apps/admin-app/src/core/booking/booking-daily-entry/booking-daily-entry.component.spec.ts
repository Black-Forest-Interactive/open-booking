import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDailyEntryComponent } from './booking-daily-entry.component';

describe('BookingDailyEntryComponent', () => {
  let component: BookingDailyEntryComponent;
  let fixture: ComponentFixture<BookingDailyEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDailyEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDailyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
