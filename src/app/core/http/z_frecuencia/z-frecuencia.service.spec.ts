import { TestBed } from '@angular/core/testing';

import { ZFrecuenciaService } from './z-frecuencia.service';

describe('ZFrecuenciaService', () => {
  let service: ZFrecuenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZFrecuenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
