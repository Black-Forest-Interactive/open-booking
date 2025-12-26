import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDeleteDialogComponent } from './response-delete-dialog.component';

describe('ResponseDeleteDialogComponent', () => {
  let component: ResponseDeleteDialogComponent;
  let fixture: ComponentFixture<ResponseDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
