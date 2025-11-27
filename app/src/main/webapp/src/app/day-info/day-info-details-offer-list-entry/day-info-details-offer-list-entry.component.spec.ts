import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDetailsOfferListEntryComponent} from './day-info-details-offer-list-entry.component';

describe('DayInfoDetailsOfferListEntryComponent', () => {
  let component: DayInfoDetailsOfferListEntryComponent;
  let fixture: ComponentFixture<DayInfoDetailsOfferListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDetailsOfferListEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDetailsOfferListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
