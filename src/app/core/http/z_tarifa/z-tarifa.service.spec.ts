import { TestBed } from '@angular/core/testing';

import { ZTarifaService } from './z-tarifa.service';

describe('ZTarifaService', () => {
  let service: ZTarifaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZTarifaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
