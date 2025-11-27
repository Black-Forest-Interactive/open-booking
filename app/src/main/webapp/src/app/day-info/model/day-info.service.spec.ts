import {TestBed} from '@angular/core/testing';

import {DayInfoService} from './day-info.service';

describe('DayInfoService', () => {
  let service: DayInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
