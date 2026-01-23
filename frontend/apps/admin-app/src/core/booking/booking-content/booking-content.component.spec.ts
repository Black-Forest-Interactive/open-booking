import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingContentComponent } from './booking-content.component';

describe('BookingContentComponent', () => {
  let component: BookingContentComponent;
  let fixture: ComponentFixture<BookingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
