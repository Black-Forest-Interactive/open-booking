import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestProcessDialogComponent} from './request-process-dialog.component';

describe('RequestProcessDialogComponent', () => {
  let component: RequestProcessDialogComponent;
  let fixture: ComponentFixture<RequestProcessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestProcessDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
