import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingResizeDialogComponent } from './booking-resize-dialog.component';

describe('BookingResizeDialogComponent', () => {
  let component: BookingResizeDialogComponent;
  let fixture: ComponentFixture<BookingResizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingResizeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingResizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
