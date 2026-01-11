import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFeatureRelabelDialogComponent } from './offer-feature-relabel-dialog.component';

describe('OfferFeatureRelabelDialogComponent', () => {
  let component: OfferFeatureRelabelDialogComponent;
  let fixture: ComponentFixture<OfferFeatureRelabelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFeatureRelabelDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFeatureRelabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
