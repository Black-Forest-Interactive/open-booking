import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInfoComponent } from './editor-info.component';

describe('EditorInfoComponent', () => {
  let component: EditorInfoComponent;
  let fixture: ComponentFixture<EditorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
