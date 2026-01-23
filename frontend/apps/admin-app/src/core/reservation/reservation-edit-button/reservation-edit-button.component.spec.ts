import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationEditButtonComponent } from './reservation-edit-button.component';

describe('ReservationEditButtonComponent', () => {
  let component: ReservationEditButtonComponent;
  let fixture: ComponentFixture<ReservationEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationEditButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
