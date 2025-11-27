import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailBoardComponent } from './mail-board.component';

describe('MailBoardComponent', () => {
  let component: MailBoardComponent;
  let fixture: ComponentFixture<MailBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
