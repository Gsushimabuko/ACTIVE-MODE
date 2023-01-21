import { TestBed } from '@angular/core/testing';

import { ZHorarioService } from './z-horario.service';

describe('ZHorarioService', () => {
  let service: ZHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
