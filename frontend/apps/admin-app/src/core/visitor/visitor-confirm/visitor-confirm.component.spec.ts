import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorConfirmComponent } from './visitor-confirm.component';

describe('VisitorConfirmComponent', () => {
  let component: VisitorConfirmComponent;
  let fixture: ComponentFixture<VisitorConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
