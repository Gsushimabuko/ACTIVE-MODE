import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PasarelaService } from 'src/app/core/http/pasarela/pasarela.service';

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent {
  @Input() listaPagosPrecio: any;
  @Input() idUsuario!: number;
  @Input() monto!: number;
  @Input() fechaCalendario!: Date;
  @Output() pagoAceptado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() matricula: EventEmitter<boolean> = new EventEmitter<boolean>();

  errorFlag: boolean = false;
  errorMessage: string = '';
  procesando: boolean = false;

  constructor(private pasarelaService: PasarelaService) { }

  sendSignal() {
    this.matricula.emit(true);
  }

  // El pago ya no se confirma aquí: se crea el cargo en Cobrana y se sale a su pasarela.
  pagar() {
    if (this.procesando) return;
    this.procesando = true;
    this.errorFlag = false;

    const ano = this.fechaCalendario.getFullYear();
    const mes = this.fechaCalendario.getMonth();

    this.pasarelaService.createPayment(this.monto, this.listaPagosPrecio, this.idUsuario, ano, mes).subscribe({
      next: (cargo) => {
        window.location.href = cargo.paymentUrl;
      },
      error: (error: any) => {
        this.procesando = false;
        this.errorFlag = true;
        this.errorMessage = error.error?.mensaje || 'No pudimos iniciar el pago. Inténtalo nuevamente.';
        this.pagoAceptado.emit(false);
      }
    });
  }
}
