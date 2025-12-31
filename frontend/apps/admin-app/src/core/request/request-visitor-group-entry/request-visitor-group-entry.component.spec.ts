import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestVisitorEntryComponent} from './request-visitor-group-entry.component';

describe('RequestVisitorEntryComponent', () => {
  let component: RequestVisitorEntryComponent;
  let fixture: ComponentFixture<RequestVisitorEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestVisitorEntryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RequestVisitorEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
