import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestBoardBookingCellComponent} from './request-board-booking-cell.component';

describe('RequestBoardBookingCellComponent', () => {
  let component: RequestBoardBookingCellComponent;
  let fixture: ComponentFixture<RequestBoardBookingCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBoardBookingCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestBoardBookingCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
