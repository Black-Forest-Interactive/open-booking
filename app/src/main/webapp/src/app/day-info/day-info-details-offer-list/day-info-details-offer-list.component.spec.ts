import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDetailsOfferListComponent} from './day-info-details-offer-list.component';

describe('DayInfoDetailsOfferListComponent', () => {
  let component: DayInfoDetailsOfferListComponent;
  let fixture: ComponentFixture<DayInfoDetailsOfferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDetailsOfferListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDetailsOfferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
