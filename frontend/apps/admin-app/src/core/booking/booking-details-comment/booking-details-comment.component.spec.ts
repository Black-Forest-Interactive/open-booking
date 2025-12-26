import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsCommentComponent } from './booking-details-comment.component';

describe('BookingDetailsCommentComponent', () => {
  let component: BookingDetailsCommentComponent;
  let fixture: ComponentFixture<BookingDetailsCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
