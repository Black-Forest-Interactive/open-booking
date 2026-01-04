import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationProcessDialogComponent } from './reservation-process-dialog.component';

describe('ReservationProcessDialogComponent', () => {
  let component: ReservationProcessDialogComponent;
  let fixture: ComponentFixture<ReservationProcessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationProcessDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
