import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFeatureCreateSingleDialogComponent } from './offer-feature-create-single-dialog.component';

describe('OfferFeatureCreateSingleDialogComponent', () => {
  let component: OfferFeatureCreateSingleDialogComponent;
  let fixture: ComponentFixture<OfferFeatureCreateSingleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFeatureCreateSingleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFeatureCreateSingleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
