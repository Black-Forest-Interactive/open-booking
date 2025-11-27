import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuditBoardComponent} from './audit-board.component';

describe('AuditBoardComponent', () => {
  let component: AuditBoardComponent;
  let fixture: ComponentFixture<AuditBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
