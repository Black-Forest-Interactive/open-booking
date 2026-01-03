import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReservationSuccessDialogComponent} from './reservation-success-dialog.component';

describe('BookingSuccessDialogComponent', () => {
  let component: ReservationSuccessDialogComponent;
  let fixture: ComponentFixture<ReservationSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationSuccessDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
