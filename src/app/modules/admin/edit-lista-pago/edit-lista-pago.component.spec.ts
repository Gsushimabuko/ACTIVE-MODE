import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListaPagoComponent } from './edit-lista-pago.component';

describe('EditListaPagoComponent', () => {
  let component: EditListaPagoComponent;
  let fixture: ComponentFixture<EditListaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditListaPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditListaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
