import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoDetailsListComponent} from './day-info-details-list.component';

describe('DayInfoDetailsListComponent', () => {
  let component: DayInfoDetailsListComponent;
  let fixture: ComponentFixture<DayInfoDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
