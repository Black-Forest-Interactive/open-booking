import {TestBed} from '@angular/core/testing';

import {NotificationTemplateService} from './notification-template.service';

describe('NotificationTemplateService', () => {
  let service: NotificationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
