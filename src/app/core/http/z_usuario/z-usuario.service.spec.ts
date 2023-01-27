import { TestBed } from '@angular/core/testing';

import { ZUsuarioService } from './z-usuario.service';

describe('ZUsuarioService', () => {
  let service: ZUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
