import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFeatureCreateSeriesDialogComponent } from './offer-feature-create-series-dialog.component';

describe('OfferFeatureCreateSeriesDialogComponent', () => {
  let component: OfferFeatureCreateSeriesDialogComponent;
  let fixture: ComponentFixture<OfferFeatureCreateSeriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFeatureCreateSeriesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFeatureCreateSeriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
