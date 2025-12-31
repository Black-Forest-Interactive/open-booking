import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelChangeComponent } from './label-change.component';

describe('LabelChangeComponent', () => {
  let component: LabelChangeComponent;
  let fixture: ComponentFixture<LabelChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
