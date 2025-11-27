import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoRangeSelectionComponent} from './day-info-range-selection.component';

describe('DayInfoRangeSelectionComponent', () => {
  let component: DayInfoRangeSelectionComponent;
  let fixture: ComponentFixture<DayInfoRangeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoRangeSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoRangeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
