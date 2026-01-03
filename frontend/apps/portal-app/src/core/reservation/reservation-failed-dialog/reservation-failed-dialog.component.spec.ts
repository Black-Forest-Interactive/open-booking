import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReservationFailedDialogComponent} from './reservation-failed-dialog.component';

describe('BookingFailedDialogComponent', () => {
  let component: ReservationFailedDialogComponent;
  let fixture: ComponentFixture<ReservationFailedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationFailedDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationFailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
