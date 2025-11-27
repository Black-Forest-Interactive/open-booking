import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyVisitorStatsComponent } from './daily-visitor-stats.component';

describe('DailyVisitorStatsComponent', () => {
  let component: DailyVisitorStatsComponent;
  let fixture: ComponentFixture<DailyVisitorStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyVisitorStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyVisitorStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
