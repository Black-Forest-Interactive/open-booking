import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingBoardEntryComponent } from './booking-board-entry.component';

describe('BookingBoardEntryComponent', () => {
  let component: BookingBoardEntryComponent;
  let fixture: ComponentFixture<BookingBoardEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingBoardEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingBoardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
