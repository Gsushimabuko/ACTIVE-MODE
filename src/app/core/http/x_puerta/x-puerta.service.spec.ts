import { TestBed } from '@angular/core/testing';

import { XPuertaService } from './x-puerta.service';

describe('XPuertaService', () => {
  let service: XPuertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XPuertaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
