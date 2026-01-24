import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingGroupListComponent } from './booking-group-list.component';

describe('BookingGroupListComponent', () => {
  let component: BookingGroupListComponent;
  let fixture: ComponentFixture<BookingGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingGroupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
