import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookingFailedDialogComponent } from './create-booking-failed-dialog.component';

describe('CreateBookingFailedDialogComponent', () => {
  let component: CreateBookingFailedDialogComponent;
  let fixture: ComponentFixture<CreateBookingFailedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBookingFailedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBookingFailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
