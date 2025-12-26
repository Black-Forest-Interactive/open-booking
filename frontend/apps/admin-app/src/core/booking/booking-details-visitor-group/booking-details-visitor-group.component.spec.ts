import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsVisitorGroupComponent } from './booking-details-visitor-group.component';

describe('BookingDetailsVisitorGroupComponent', () => {
  let component: BookingDetailsVisitorGroupComponent;
  let fixture: ComponentFixture<BookingDetailsVisitorGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsVisitorGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsVisitorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
