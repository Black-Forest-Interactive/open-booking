import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBookingEntryComponent } from './request-booking-entry.component';

describe('RequestBookingEntryComponent', () => {
  let component: RequestBookingEntryComponent;
  let fixture: ComponentFixture<RequestBookingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestBookingEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestBookingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
