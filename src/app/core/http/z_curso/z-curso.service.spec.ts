import { TestBed } from '@angular/core/testing';

import { ZCursoService } from './z-curso.service';

describe('ZCursoService', () => {
  let service: ZCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
