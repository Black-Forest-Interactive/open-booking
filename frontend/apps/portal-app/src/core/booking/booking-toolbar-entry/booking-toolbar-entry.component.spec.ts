import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingToolbarEntryComponent } from './booking-toolbar-entry.component';

describe('BookingToolbarEntryComponent', () => {
  let component: BookingToolbarEntryComponent;
  let fixture: ComponentFixture<BookingToolbarEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingToolbarEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingToolbarEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
