import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResponseChangeComponent} from './response-change.component';

describe('ResponseChangeComponent', () => {
  let component: ResponseChangeComponent;
  let fixture: ComponentFixture<ResponseChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
