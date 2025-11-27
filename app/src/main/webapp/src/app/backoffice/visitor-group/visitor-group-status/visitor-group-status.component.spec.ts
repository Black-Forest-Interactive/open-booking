import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorGroupStatusComponent } from './visitor-group-status.component';

describe('VisitorGroupStatusComponent', () => {
  let component: VisitorGroupStatusComponent;
  let fixture: ComponentFixture<VisitorGroupStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorGroupStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorGroupStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
