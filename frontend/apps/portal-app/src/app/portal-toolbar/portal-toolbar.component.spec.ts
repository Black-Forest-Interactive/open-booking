import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortalToolbarComponent} from './portal-toolbar.component';

describe('AdminToolbarComponent', () => {
  let component: PortalToolbarComponent;
  let fixture: ComponentFixture<PortalToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalToolbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PortalToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
