import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortalContentComponent} from './portal-content.component';

describe('AdminContentComponent', () => {
  let component: PortalContentComponent;
  let fixture: ComponentFixture<PortalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalContentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PortalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
