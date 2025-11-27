import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingAdminBoardComponent} from './booking-admin-board.component';

describe('BookingAdminBoardComponent', () => {
  let component: BookingAdminBoardComponent;
  let fixture: ComponentFixture<BookingAdminBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAdminBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingAdminBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
