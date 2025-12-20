import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsContentComponent } from './booking-details-content.component';

describe('BookingDetailsContentComponent', () => {
  let component: BookingDetailsContentComponent;
  let fixture: ComponentFixture<BookingDetailsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
