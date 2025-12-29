import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFailedDialogComponent } from './booking-failed-dialog.component';

describe('BookingFailedDialogComponent', () => {
  let component: BookingFailedDialogComponent;
  let fixture: ComponentFixture<BookingFailedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFailedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
