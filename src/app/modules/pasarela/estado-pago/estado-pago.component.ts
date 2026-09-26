import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultadoPago } from '../pasarela.component';

@Component({
  selector: 'app-estado-pago',
  templateUrl: './estado-pago.component.html',
  styleUrls: ['./estado-pago.component.css']
})
export class EstadoPagoComponent {
  @Input() resultado!: ResultadoPago;
  // Solo en modo invitado: a dónde llega el comprobante.
  @Input() correoInvitado: string | null = null;
  @Output() reintentar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();

  // 409 = el DNI del invitado ya tiene cuenta: tiene que iniciar sesión, reintentar no sirve.
  get dniConCuenta(): boolean {
    return this.resultado.estado === 'fallido' && this.resultado.status === 409;
  }
}
