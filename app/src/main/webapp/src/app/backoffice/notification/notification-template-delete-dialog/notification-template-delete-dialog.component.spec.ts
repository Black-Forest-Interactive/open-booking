import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationTemplateDeleteDialogComponent} from './notification-template-delete-dialog.component';

describe('NotificationTemplateDeleteDialogComponent', () => {
  let component: NotificationTemplateDeleteDialogComponent;
  let fixture: ComponentFixture<NotificationTemplateDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationTemplateDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
