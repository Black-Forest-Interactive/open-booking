import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchBoardComponent} from './search-board.component';

describe('SearchBoardComponent', () => {
  let component: SearchBoardComponent;
  let fixture: ComponentFixture<SearchBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
