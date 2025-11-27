import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoBoardActionsComponent} from './day-info-board-actions.component';

describe('DayInfoBoardActionsComponent', () => {
  let component: DayInfoBoardActionsComponent;
  let fixture: ComponentFixture<DayInfoBoardActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoBoardActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoBoardActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
