import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorGroupChangeComponent } from './visitor-group-change.component';

describe('VisitorGroupChangeComponent', () => {
  let component: VisitorGroupChangeComponent;
  let fixture: ComponentFixture<VisitorGroupChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorGroupChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorGroupChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
