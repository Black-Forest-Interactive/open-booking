import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestCommentDialogComponent} from './request-comment-dialog.component';

describe('RequestCommentDialogComponent', () => {
  let component: RequestCommentDialogComponent;
  let fixture: ComponentFixture<RequestCommentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestCommentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
