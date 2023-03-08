import { TestBed } from '@angular/core/testing';

import { ZDiaService } from './z-dia.service';

describe('ZDiaService', () => {
  let service: ZDiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZDiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
