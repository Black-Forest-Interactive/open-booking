import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingDetailsInfoDialogComponent} from './booking-details-info-dialog.component';

describe('BookingDetailsInfoDialogComponent', () => {
  let component: BookingDetailsInfoDialogComponent;
  let fixture: ComponentFixture<BookingDetailsInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDetailsInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
