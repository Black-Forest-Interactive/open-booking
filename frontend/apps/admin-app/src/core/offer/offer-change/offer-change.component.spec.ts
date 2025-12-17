import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferChangeComponent } from './offer-change.component';

describe('OfferChangeComponent', () => {
  let component: OfferChangeComponent;
  let fixture: ComponentFixture<OfferChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
