import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffChangeComponent } from './staff-change.component';

describe('StaffChangeComponent', () => {
  let component: StaffChangeComponent;
  let fixture: ComponentFixture<StaffChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
