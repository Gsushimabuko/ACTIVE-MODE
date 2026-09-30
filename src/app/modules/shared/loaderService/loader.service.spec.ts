import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('mantiene el loader inicial visible por al menos 1.4 segundos', fakeAsync(() => {
    let visible = false;
    service.loading$.subscribe((value) => (visible = value));

    service.hide();
    expect(visible).toBeTrue();
    tick(1399);
    expect(visible).toBeTrue();
    tick(1);
    expect(visible).toBeFalse();
  }));

  it('mantiene cada nueva carga visible por al menos 1.4 segundos', fakeAsync(() => {
    let visible = true;
    service.loading$.subscribe((value) => (visible = value));
    service.hide();
    tick(1400);

    service.show();
    service.hide();
    expect(visible).toBeTrue();
    tick(1400);
    expect(visible).toBeFalse();
  }));
});
