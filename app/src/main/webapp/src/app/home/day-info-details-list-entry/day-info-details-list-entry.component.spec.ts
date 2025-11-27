import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDetailsListEntryComponent} from './day-info-details-list-entry.component';

describe('DayInfoDetailsListEntryComponent', () => {
  let component: DayInfoDetailsListEntryComponent;
  let fixture: ComponentFixture<DayInfoDetailsListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDetailsListEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDetailsListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
