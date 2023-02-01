import { TestBed } from '@angular/core/testing';

import { ZCodigoService } from './z-codigo.service';

describe('ZCodigoService', () => {
  let service: ZCodigoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZCodigoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
