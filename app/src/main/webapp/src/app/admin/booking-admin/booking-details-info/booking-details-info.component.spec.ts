import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookingDetailsInfoComponent} from './booking-details-info.component';

describe('BookingDetailsInfoComponent', () => {
  let component: BookingDetailsInfoComponent;
  let fixture: ComponentFixture<BookingDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDetailsInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
