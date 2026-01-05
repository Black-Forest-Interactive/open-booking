import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReservationToolbarEntryComponent} from './reservation-toolbar-entry.component';

describe('BookingToolbarEntryComponent', () => {
  let component: ReservationToolbarEntryComponent;
  let fixture: ComponentFixture<ReservationToolbarEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationToolbarEntryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReservationToolbarEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
