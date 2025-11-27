import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VisitorGroupInfoDialogComponent} from './visitor-group-info-dialog.component';

describe('VisitorGroupInfoDialogComponent', () => {
  let component: VisitorGroupInfoDialogComponent;
  let fixture: ComponentFixture<VisitorGroupInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorGroupInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorGroupInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
