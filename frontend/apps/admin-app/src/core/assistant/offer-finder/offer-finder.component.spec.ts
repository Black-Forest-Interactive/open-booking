import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFinderComponent } from './offer-finder.component';

describe('OfferFinderComponent', () => {
  let component: OfferFinderComponent;
  let fixture: ComponentFixture<OfferFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFinderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
