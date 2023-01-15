import { TestBed } from '@angular/core/testing';

import { ZPagoService } from './z-pago.service';

describe('ZPagoService', () => {
  let service: ZPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
