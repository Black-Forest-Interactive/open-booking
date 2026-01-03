import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationContentComponent } from './reservation-content.component';

describe('ReservationContentComponent', () => {
  let component: ReservationContentComponent;
  let fixture: ComponentFixture<ReservationContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
