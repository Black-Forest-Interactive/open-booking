import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsDialogComponent } from './booking-details-dialog.component';

describe('BookingDetailsDialogComponent', () => {
  let component: BookingDetailsDialogComponent;
  let fixture: ComponentFixture<BookingDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
