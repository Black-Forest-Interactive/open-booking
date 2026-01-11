import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferAssignmentComponent } from './offer-assignment.component';

describe('OfferAssignmentComponent', () => {
  let component: OfferAssignmentComponent;
  let fixture: ComponentFixture<OfferAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
