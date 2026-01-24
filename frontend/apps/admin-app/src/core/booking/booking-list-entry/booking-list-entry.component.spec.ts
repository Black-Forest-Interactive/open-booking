import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingListEntryComponent } from './booking-list-entry.component';

describe('BookingListEntryComponent', () => {
  let component: BookingListEntryComponent;
  let fixture: ComponentFixture<BookingListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingListEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
