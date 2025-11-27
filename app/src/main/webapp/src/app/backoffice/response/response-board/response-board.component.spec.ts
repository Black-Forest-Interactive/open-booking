import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResponseBoardComponent} from './response-board.component';

describe('ResponseBoardComponent', () => {
  let component: ResponseBoardComponent;
  let fixture: ComponentFixture<ResponseBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
