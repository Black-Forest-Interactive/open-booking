import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCreateSeriesComponent } from './offer-create-series.component';

describe('OfferCreateSeriesComponent', () => {
  let component: OfferCreateSeriesComponent;
  let fixture: ComponentFixture<OfferCreateSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCreateSeriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferCreateSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
