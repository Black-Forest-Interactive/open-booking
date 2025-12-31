import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VisitorChangeComponent} from './visitor-change.component';

describe('GroupChangeComponent', () => {
  let component: VisitorChangeComponent;
  let fixture: ComponentFixture<VisitorChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorChangeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VisitorChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
