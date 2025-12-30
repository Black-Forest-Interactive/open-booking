import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardContentEntryComponent} from './dashboard-content-entry.component';

describe('DashboardContentEntryComponent', () => {
  let component: DashboardContentEntryComponent;
  let fixture: ComponentFixture<DashboardContentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContentEntryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardContentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
