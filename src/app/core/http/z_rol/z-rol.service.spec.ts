import { TestBed } from '@angular/core/testing';

import { ZRolService } from './z-rol.service';

describe('ZRolService', () => {
  let service: ZRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
