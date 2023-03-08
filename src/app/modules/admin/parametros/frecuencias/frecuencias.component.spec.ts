import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrecuenciasComponent } from './frecuencias.component';

describe('FrecuenciasComponent', () => {
  let component: FrecuenciasComponent;
  let fixture: ComponentFixture<FrecuenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrecuenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrecuenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
