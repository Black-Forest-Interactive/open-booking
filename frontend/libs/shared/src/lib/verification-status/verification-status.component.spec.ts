import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationStatusComponent } from './verification-status.component';

describe('VerificationStatusComponent', () => {
  let component: VerificationStatusComponent;
  let fixture: ComponentFixture<VerificationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
