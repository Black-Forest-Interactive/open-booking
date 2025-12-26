import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCreateRangeComponent } from './offer-create-range.component';

describe('OfferCreateRangeComponent', () => {
  let component: OfferCreateRangeComponent;
  let fixture: ComponentFixture<OfferCreateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCreateRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferCreateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
