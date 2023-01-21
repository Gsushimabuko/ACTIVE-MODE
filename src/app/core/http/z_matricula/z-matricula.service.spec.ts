import { TestBed } from '@angular/core/testing';

import { ZMatriculaService } from './z-matricula.service';

describe('ZMatriculaService', () => {
  let service: ZMatriculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZMatriculaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
