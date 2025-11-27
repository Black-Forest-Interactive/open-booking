import {TestBed} from '@angular/core/testing';

import {BookingRequestService} from './booking-request.service';

describe('BookingRequestService', () => {
  let service: BookingRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
