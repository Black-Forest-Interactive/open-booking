import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VisitorInfoDialogComponent} from './visitor-info-dialog.component';

describe('GroupInfoDialogComponent', () => {
  let component: VisitorInfoDialogComponent;
  let fixture: ComponentFixture<VisitorInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorInfoDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VisitorInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
