import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferContentEntryComponent } from './offer-content-entry.component';

describe('OfferContentEntryComponent', () => {
  let component: OfferContentEntryComponent;
  let fixture: ComponentFixture<OfferContentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferContentEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferContentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
