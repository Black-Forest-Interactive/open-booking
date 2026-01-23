import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericResultDialogComponent } from './generic-result-dialog.component';

describe('GenericResultDialogComponent', () => {
  let component: GenericResultDialogComponent;
  let fixture: ComponentFixture<GenericResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericResultDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericResultDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
