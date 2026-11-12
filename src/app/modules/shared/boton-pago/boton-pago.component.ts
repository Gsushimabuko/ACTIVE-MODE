import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ClientePago, UPaymentService } from 'src/app/core/http/u_payment/u-payment.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
	selector: 'app-boton-pago',
	templateUrl: './boton-pago.component.html',
	styleUrls: ['./boton-pago.component.css']
})
export class BotonPagoComponent {
	@Output() clicked = new EventEmitter<void>();
	@Output() cargoCreado = new EventEmitter<string>();

	@Input() uuid: string = '';
	@Input() cliente: ClientePago | null = null;
	@Input() disabled = false;

	procesando = false;

	constructor(
		private readonly paymentService: UPaymentService,
		private readonly dialog: MatDialog,
	) { }

	pay() {
		this.clicked.emit();

		if (this.disabled || this.procesando || !this.uuid) return;
		this.procesando = true;

		// La pestaña se abre en el mismo clic: si se abre después de esperar al backend, Safari y Firefox la bloquean.
		const pestana = window.open('', '_blank');
		if (pestana) pestana.opener = null;

		this.paymentService.cobrar(this.uuid, this.cliente).pipe(
			finalize(() => this.procesando = false)
		).subscribe({
			next: ({ paymentUrl }) => {
				this.cargoCreado.emit(paymentUrl);
				if (pestana) pestana.location.href = paymentUrl;
				else window.location.assign(paymentUrl);
			},
			error: (error) => {
				pestana?.close();
				this.dialog.open(ErrorDialogComponent, {
					width: '300px',
					data: {
						title: 'Ocurrió un error',
						message: error.error?.mensaje || 'No pudimos iniciar el pago. Por favor, inténtelo nuevamente en unos minutos.',
					}
				});
			},
		});
	}
}
