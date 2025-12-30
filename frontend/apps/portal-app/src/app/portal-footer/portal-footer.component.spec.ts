import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortalFooterComponent} from './portal-footer.component';

describe('AdminFooterComponent', () => {
  let component: PortalFooterComponent;
  let fixture: ComponentFixture<PortalFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalFooterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PortalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
