import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationOfferCapacityVisualizationComponent } from './reservation-offer-capacity-visualization.component';

describe('ReservationOfferCapacityVisualizationComponent', () => {
  let component: ReservationOfferCapacityVisualizationComponent;
  let fixture: ComponentFixture<ReservationOfferCapacityVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationOfferCapacityVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationOfferCapacityVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
