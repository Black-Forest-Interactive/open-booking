import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDetailsComponent } from './response-details.component';

describe('ResponseDetailsComponent', () => {
  let component: ResponseDetailsComponent;
  let fixture: ComponentFixture<ResponseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
