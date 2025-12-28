import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEntryComponent } from './booking-entry.component';

describe('BookingEntryComponent', () => {
  let component: BookingEntryComponent;
  let fixture: ComponentFixture<BookingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
