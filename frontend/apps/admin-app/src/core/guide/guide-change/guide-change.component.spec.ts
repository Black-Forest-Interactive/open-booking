import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GuideChangeComponent} from './guide-change.component';

describe('GuideChangeComponent', () => {
  let component: GuideChangeComponent;
  let fixture: ComponentFixture<GuideChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideChangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GuideChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
