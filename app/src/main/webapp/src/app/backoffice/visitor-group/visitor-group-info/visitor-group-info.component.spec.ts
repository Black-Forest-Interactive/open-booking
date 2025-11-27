import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VisitorGroupInfoComponent} from './visitor-group-info.component';

describe('VisitorGroupInfoComponent', () => {
  let component: VisitorGroupInfoComponent;
  let fixture: ComponentFixture<VisitorGroupInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorGroupInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
