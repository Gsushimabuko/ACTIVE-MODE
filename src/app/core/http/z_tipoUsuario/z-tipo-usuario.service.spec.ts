import { TestBed } from '@angular/core/testing';

import { ZTipoUsuarioService } from './z-tipo-usuario.service';

describe('ZTipoUsuarioService', () => {
  let service: ZTipoUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZTipoUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
