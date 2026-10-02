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

  // El código distingue este 409 de otros conflictos, como una matrícula duplicada.
  get dniConCuenta(): boolean {
    return this.resultado.estado === 'fallido' && this.resultado.codigo === 'dni_con_cuenta';
  }

  get permiteReintentar(): boolean {
    return this.resultado.estado === 'fallido'
      && !['dni_con_cuenta', 'matricula_duplicada'].includes(this.resultado.codigo || '');
  }
}
