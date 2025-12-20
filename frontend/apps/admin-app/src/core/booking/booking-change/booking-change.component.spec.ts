import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingChangeComponent } from './booking-change.component';

describe('BookingChangeComponent', () => {
  let component: BookingChangeComponent;
  let fixture: ComponentFixture<BookingChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
