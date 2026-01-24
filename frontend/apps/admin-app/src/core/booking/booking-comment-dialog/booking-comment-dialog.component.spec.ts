import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCommentDialogComponent } from './booking-comment-dialog.component';

describe('BookingCommentDialogComponent', () => {
  let component: BookingCommentDialogComponent;
  let fixture: ComponentFixture<BookingCommentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCommentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
