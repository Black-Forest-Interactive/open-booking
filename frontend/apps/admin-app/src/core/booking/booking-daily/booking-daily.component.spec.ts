import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDailyComponent } from './booking-daily.component';

describe('BookingDailyComponent', () => {
  let component: BookingDailyComponent;
  let fixture: ComponentFixture<BookingDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDailyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
