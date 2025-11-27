import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CacheBoardComponent} from './cache-board.component';

describe('CacheBoardComponent', () => {
  let component: CacheBoardComponent;
  let fixture: ComponentFixture<CacheBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CacheBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CacheBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
