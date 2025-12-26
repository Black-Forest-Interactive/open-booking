import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContentEntryBookingComponent } from './dashboard-content-entry-booking.component';

describe('DashboardContentEntryBookingComponent', () => {
  let component: DashboardContentEntryBookingComponent;
  let fixture: ComponentFixture<DashboardContentEntryBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentEntryBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardContentEntryBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
