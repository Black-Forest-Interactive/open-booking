import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsHeaderComponent } from './booking-details-header.component';

describe('BookingDetailsHeaderComponent', () => {
  let component: BookingDetailsHeaderComponent;
  let fixture: ComponentFixture<BookingDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDetailsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
