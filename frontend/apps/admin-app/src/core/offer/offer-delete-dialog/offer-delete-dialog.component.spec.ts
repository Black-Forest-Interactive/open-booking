import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDeleteDialogComponent } from './offer-delete-dialog.component';

describe('OfferDeleteDialogComponent', () => {
  let component: OfferDeleteDialogComponent;
  let fixture: ComponentFixture<OfferDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
