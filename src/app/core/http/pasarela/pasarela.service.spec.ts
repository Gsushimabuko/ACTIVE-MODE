import { TestBed } from '@angular/core/testing';

import { PasarelaService } from './pasarela.service';

describe('PasarelaService', () => {
  let service: PasarelaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasarelaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
