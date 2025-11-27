import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeDetailsBoardComponent} from './home-details-board.component';

describe('HomeDetailsBoardComponent', () => {
  let component: HomeDetailsBoardComponent;
  let fixture: ComponentFixture<HomeDetailsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDetailsBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDetailsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
