import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateBookingConfirmationDialogComponent} from './create-booking-confirmation-dialog.component';

describe('CreateBookingConfirmationDialogComponent', () => {
  let component: CreateBookingConfirmationDialogComponent;
  let fixture: ComponentFixture<CreateBookingConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBookingConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBookingConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
