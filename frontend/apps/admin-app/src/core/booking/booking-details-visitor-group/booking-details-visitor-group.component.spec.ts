import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingDetailsVisitorComponent} from './booking-details-visitor-group.component';

describe('BookingDetailsVisitorComponent', () => {
  let component: BookingDetailsVisitorComponent;
  let fixture: ComponentFixture<BookingDetailsVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsVisitorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
