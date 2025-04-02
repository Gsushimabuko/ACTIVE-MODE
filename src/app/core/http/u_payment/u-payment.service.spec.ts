import { TestBed } from '@angular/core/testing';

import { UPaymentService } from './u-payment.service';

describe('UPaymentService', () => {
  let service: UPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
