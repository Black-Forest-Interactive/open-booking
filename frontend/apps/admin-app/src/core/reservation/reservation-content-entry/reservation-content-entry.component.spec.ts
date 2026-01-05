import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationContentEntryComponent } from './reservation-content-entry.component';

describe('ReservationContentEntryComponent', () => {
  let component: ReservationContentEntryComponent;
  let fixture: ComponentFixture<ReservationContentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationContentEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationContentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
