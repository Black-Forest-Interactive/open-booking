import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestBoardComponent} from './request-board.component';

describe('RequestBoardComponent', () => {
  let component: RequestBoardComponent;
  let fixture: ComponentFixture<RequestBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
