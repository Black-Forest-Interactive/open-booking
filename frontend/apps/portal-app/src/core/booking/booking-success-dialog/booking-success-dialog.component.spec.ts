import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSuccessDialogComponent } from './booking-success-dialog.component';

describe('BookingSuccessDialogComponent', () => {
  let component: BookingSuccessDialogComponent;
  let fixture: ComponentFixture<BookingSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSuccessDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
