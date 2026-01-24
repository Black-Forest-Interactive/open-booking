import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCreateDialogComponent } from './booking-create-dialog.component';

describe('BookingCreateDialogComponent', () => {
  let component: BookingCreateDialogComponent;
  let fixture: ComponentFixture<BookingCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
