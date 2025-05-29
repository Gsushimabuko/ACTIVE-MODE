import { TestBed } from '@angular/core/testing';

import { UTransactionService } from './u-transaction.service';

describe('UTransactionService', () => {
  let service: UTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
