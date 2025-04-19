import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearListaPagoComponent } from './crear-lista-pago.component';

describe('CrearListaPagoComponent', () => {
  let component: CrearListaPagoComponent;
  let fixture: ComponentFixture<CrearListaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearListaPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearListaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
