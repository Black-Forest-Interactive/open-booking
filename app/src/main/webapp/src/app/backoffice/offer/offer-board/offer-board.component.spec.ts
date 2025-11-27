import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferBoardComponent} from './offer-board.component';

describe('OfferBoardComponent', () => {
  let component: OfferBoardComponent;
  let fixture: ComponentFixture<OfferBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
