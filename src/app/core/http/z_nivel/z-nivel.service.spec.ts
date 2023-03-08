import { TestBed } from '@angular/core/testing';

import { ZNivelService } from './z-nivel.service';

describe('ZNivelService', () => {
  let service: ZNivelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZNivelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
