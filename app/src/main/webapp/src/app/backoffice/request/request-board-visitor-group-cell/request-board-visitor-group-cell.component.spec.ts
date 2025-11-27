import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestBoardVisitorGroupCellComponent} from './request-board-visitor-group-cell.component';

describe('RequestBoardVisitorGroupCellComponent', () => {
  let component: RequestBoardVisitorGroupCellComponent;
  let fixture: ComponentFixture<RequestBoardVisitorGroupCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBoardVisitorGroupCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestBoardVisitorGroupCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
