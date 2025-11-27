import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingChangeComponent } from './setting-change.component';

describe('SettingChangeComponent', () => {
  let component: SettingChangeComponent;
  let fixture: ComponentFixture<SettingChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
