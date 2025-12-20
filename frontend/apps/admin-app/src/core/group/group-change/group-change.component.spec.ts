import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChangeComponent } from './group-change.component';

describe('GroupChangeComponent', () => {
  let component: GroupChangeComponent;
  let fixture: ComponentFixture<GroupChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
