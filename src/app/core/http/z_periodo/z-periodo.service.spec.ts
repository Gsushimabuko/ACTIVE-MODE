import { TestBed } from '@angular/core/testing';

import { ZPeriodoService } from './z-periodo.service';

describe('ZPeriodoService', () => {
  let service: ZPeriodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZPeriodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
