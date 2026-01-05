import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferContentComponent } from './offer-content.component';

describe('OfferContentComponent', () => {
  let component: OfferContentComponent;
  let fixture: ComponentFixture<OfferContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
