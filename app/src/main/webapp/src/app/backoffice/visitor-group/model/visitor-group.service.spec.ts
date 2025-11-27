import {TestBed} from '@angular/core/testing';

import {VisitorGroupService} from './visitor-group.service';

describe('VisitorGroupService', () => {
  let service: VisitorGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitorGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
