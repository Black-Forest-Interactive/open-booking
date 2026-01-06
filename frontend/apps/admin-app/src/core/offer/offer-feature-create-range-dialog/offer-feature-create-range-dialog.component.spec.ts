import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFeatureCreateRangeDialogComponent } from './offer-feature-create-range-dialog.component';

describe('OfferFeatureCreateRangeDialogComponent', () => {
  let component: OfferFeatureCreateRangeDialogComponent;
  let fixture: ComponentFixture<OfferFeatureCreateRangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFeatureCreateRangeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFeatureCreateRangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
