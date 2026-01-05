import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReservationEntryComponent} from './reservation-entry.component';

describe('BookingEntryComponent', () => {
  let component: ReservationEntryComponent;
  let fixture: ComponentFixture<ReservationEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationEntryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
