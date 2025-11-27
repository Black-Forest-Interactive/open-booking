import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditLogEntryDetailsComponent} from './audit-log-entry-details.component';

describe('AuditLogEntryDetailsComponent', () => {
  let component: AuditLogEntryDetailsComponent;
  let fixture: ComponentFixture<AuditLogEntryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditLogEntryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
