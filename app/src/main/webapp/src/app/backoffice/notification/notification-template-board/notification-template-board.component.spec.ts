import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationTemplateBoardComponent} from './notification-template-board.component';

describe('NotificationTemplateBoardComponent', () => {
  let component: NotificationTemplateBoardComponent;
  let fixture: ComponentFixture<NotificationTemplateBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationTemplateBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
