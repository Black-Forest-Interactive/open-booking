import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorChangeDialogComponent } from './visitor-change-dialog.component';

describe('VisitorChangeDialogComponent', () => {
  let component: VisitorChangeDialogComponent;
  let fixture: ComponentFixture<VisitorChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorChangeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
