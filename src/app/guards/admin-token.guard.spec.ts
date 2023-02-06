import { TestBed } from '@angular/core/testing';

import { AdminTokenGuard } from './admin-token.guard';

describe('AdminTokenGuard', () => {
  let guard: AdminTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
