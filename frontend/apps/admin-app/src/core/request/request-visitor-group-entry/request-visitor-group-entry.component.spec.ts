import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVisitorGroupEntryComponent } from './request-visitor-group-entry.component';

describe('RequestVisitorGroupEntryComponent', () => {
  let component: RequestVisitorGroupEntryComponent;
  let fixture: ComponentFixture<RequestVisitorGroupEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestVisitorGroupEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestVisitorGroupEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
