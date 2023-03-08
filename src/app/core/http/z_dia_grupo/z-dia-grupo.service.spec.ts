import { TestBed } from '@angular/core/testing';

import { ZDiaGrupoService } from './z-dia-grupo.service';

describe('ZDiaGrupoService', () => {
  let service: ZDiaGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZDiaGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
