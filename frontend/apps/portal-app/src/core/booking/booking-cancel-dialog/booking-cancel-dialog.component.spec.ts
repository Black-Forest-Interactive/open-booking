import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCancelDialogComponent } from './booking-cancel-dialog.component';

describe('BookingCancelDialogComponent', () => {
  let component: BookingCancelDialogComponent;
  let fixture: ComponentFixture<BookingCancelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCancelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingCancelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
