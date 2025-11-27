import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoBoardContentComponent} from './day-info-board-content.component';

describe('DayInfoBoardContentComponent', () => {
  let component: DayInfoBoardContentComponent;
  let fixture: ComponentFixture<DayInfoBoardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoBoardContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoBoardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
