import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorTitleComponent } from './visitor-title.component';

describe('VisitorTitleComponent', () => {
  let component: VisitorTitleComponent;
  let fixture: ComponentFixture<VisitorTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
