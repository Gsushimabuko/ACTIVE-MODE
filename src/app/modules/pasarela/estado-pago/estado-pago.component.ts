import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultadoPago } from '../pasarela.component';

@Component({
  selector: 'app-estado-pago',
  templateUrl: './estado-pago.component.html',
  styleUrls: ['./estado-pago.component.css']
})
export class EstadoPagoComponent {
  @Input() resultado!: ResultadoPago;
  @Output() reintentar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();
}
