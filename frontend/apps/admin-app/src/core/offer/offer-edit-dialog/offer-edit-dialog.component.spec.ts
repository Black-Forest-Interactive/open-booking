import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferEditDialogComponent } from './offer-edit-dialog.component';

describe('OfferEditDialogComponent', () => {
  let component: OfferEditDialogComponent;
  let fixture: ComponentFixture<OfferEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
