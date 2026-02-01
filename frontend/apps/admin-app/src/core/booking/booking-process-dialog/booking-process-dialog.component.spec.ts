import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingProcessDialogComponent } from './booking-process-dialog.component';

describe('BookingProcessDialogComponent', () => {
  let component: BookingProcessDialogComponent;
  let fixture: ComponentFixture<BookingProcessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingProcessDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
