import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRedistributeComponent } from './offer-redistribute.component';

describe('OfferRedistributeComponent', () => {
  let component: OfferRedistributeComponent;
  let fixture: ComponentFixture<OfferRedistributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferRedistributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferRedistributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
