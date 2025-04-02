import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonPagoComponent } from './boton-pago.component';

describe('BotonPagoComponent', () => {
  let component: BotonPagoComponent;
  let fixture: ComponentFixture<BotonPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotonPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
