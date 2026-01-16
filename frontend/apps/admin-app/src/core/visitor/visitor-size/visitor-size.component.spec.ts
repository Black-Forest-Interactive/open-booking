import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSizeComponent } from './visitor-size.component';

describe('VisitorSizeComponent', () => {
  let component: VisitorSizeComponent;
  let fixture: ComponentFixture<VisitorSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
