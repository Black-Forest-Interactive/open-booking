import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFeatureRedistributeDialogComponent } from './offer-feature-redistribute-dialog.component';

describe('OfferFeatureRedistributeDialogComponent', () => {
  let component: OfferFeatureRedistributeDialogComponent;
  let fixture: ComponentFixture<OfferFeatureRedistributeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFeatureRedistributeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFeatureRedistributeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
