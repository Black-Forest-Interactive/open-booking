import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDeleteDialogComponent } from './notification-delete-dialog.component';

describe('NotificationDeleteDialogComponent', () => {
  let component: NotificationDeleteDialogComponent;
  let fixture: ComponentFixture<NotificationDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
