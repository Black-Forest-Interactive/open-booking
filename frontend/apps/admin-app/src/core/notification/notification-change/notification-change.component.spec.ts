import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationChangeComponent } from './notification-change.component';

describe('NotificationChangeComponent', () => {
  let component: NotificationChangeComponent;
  let fixture: ComponentFixture<NotificationChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
