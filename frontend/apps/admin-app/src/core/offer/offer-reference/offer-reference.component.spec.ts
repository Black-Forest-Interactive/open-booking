import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferReferenceComponent } from './offer-reference.component';

describe('OfferReferenceComponent', () => {
  let component: OfferReferenceComponent;
  let fixture: ComponentFixture<OfferReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
