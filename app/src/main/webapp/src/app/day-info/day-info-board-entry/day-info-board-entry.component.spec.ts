import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoBoardEntryComponent} from './day-info-board-entry.component';

describe('DayInfoBoardEntryComponent', () => {
  let component: DayInfoBoardEntryComponent;
  let fixture: ComponentFixture<DayInfoBoardEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoBoardEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoBoardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
