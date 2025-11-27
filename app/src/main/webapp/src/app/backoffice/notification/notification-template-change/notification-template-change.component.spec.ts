import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationTemplateChangeComponent} from './notification-template-change.component';

describe('NotificationTemplateChangeComponent', () => {
  let component: NotificationTemplateChangeComponent;
  let fixture: ComponentFixture<NotificationTemplateChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationTemplateChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
