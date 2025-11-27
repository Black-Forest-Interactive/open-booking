import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoBoardComponent} from './day-info-board.component';

describe('DayInfoBoardComponent', () => {
  let component: DayInfoBoardComponent;
  let fixture: ComponentFixture<DayInfoBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
