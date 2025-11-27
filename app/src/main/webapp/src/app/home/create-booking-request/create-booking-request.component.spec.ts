import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateBookingRequestComponent} from './create-booking-request.component';

describe('CreateBookingRequestComponent', () => {
  let component: CreateBookingRequestComponent;
  let fixture: ComponentFixture<CreateBookingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBookingRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBookingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
