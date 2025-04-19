import { TestBed } from '@angular/core/testing';

import { UListasService } from './u-listas.service';

describe('UListasService', () => {
  let service: UListasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UListasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
