import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestChangeResultComponent } from './request-change-result.component';

describe('RequestChangeResultComponent', () => {
  let component: RequestChangeResultComponent;
  let fixture: ComponentFixture<RequestChangeResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestChangeResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestChangeResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
