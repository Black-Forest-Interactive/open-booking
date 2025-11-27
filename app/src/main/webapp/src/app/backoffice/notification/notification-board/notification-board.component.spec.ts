import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationBoardComponent} from './notification-board.component';

describe('NotificationBoardComponent', () => {
  let component: NotificationBoardComponent;
  let fixture: ComponentFixture<NotificationBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
