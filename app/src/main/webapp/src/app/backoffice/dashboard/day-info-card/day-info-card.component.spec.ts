import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DayInfoCardComponent} from './day-info-card.component';

describe('DayInfoCardComponent', () => {
  let component: DayInfoCardComponent;
  let fixture: ComponentFixture<DayInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
