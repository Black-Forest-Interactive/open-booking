import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingAdminDayEntryComponent} from './booking-admin-day-entry.component';

describe('BookingAdminDayEntryComponent', () => {
  let component: BookingAdminDayEntryComponent;
  let fixture: ComponentFixture<BookingAdminDayEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAdminDayEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingAdminDayEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
