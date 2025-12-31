import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VisitorStatusComponent} from './visitor-status.component';

describe('GroupStatusComponent', () => {
  let component: VisitorStatusComponent;
  let fixture: ComponentFixture<VisitorStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorStatusComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VisitorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
