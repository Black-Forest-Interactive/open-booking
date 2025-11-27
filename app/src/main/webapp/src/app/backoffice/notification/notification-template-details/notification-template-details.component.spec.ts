import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationTemplateDetailsComponent} from './notification-template-details.component';

describe('NotificationTemplateDetailsComponent', () => {
  let component: NotificationTemplateDetailsComponent;
  let fixture: ComponentFixture<NotificationTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationTemplateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
