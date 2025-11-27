import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDetailsComponent} from './day-info-details.component';

describe('DayInfoDetailsComponent', () => {
  let component: DayInfoDetailsComponent;
  let fixture: ComponentFixture<DayInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
