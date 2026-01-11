import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardContentEntryReservationComponent} from './dashboard-content-entry-reservation.component';

describe('DashboardContentEntryBookingComponent', () => {
  let component: DashboardContentEntryReservationComponent;
  let fixture: ComponentFixture<DashboardContentEntryReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentEntryReservationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardContentEntryReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
