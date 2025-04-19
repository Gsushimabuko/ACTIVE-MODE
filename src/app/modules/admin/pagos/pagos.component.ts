import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UPaymentService } from 'src/app/core/http/u_payment/u-payment.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../shared/error-dialog/error-dialog.component';
import { LoaderService } from '../../shared/loaderService/loader.service';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-pagos',
	templateUrl: './pagos.component.html',
	styleUrls: ['./pagos.component.css'],
})
export class PagosComponent {
	pagoForm: FormGroup = new FormGroup({
		var_description: new FormControl('', [Validators.required]),
		num_amount: new FormControl(0, [Validators.required, Validators.min(1)]),
		num_commission_percentage: new FormControl(0.1, [Validators.required]),
		var_email: new FormControl('', [Validators.required, Validators.email]),
	});

	commission: number = 0;
	total: number = 0;

	error: string = '';

	constructor(
		private readonly paymentService: UPaymentService,
		private readonly usuarioService: ZUsuarioService,
		private readonly loaderService: LoaderService,
		public dialog: MatDialog,
	) { }

	formatNumber(value: string): string {
		return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	calculateAmounts() {
		const amount = Number(this.pagoForm.get('num_amount')?.value);
		const commission = this.pagoForm.get('num_commission_percentage')?.value as number;
		
		this.commission = amount * commission;
		this.total = amount + this.commission;
	}

	generarPago() {
		this.error = '';

		if (this.pagoForm.invalid) {
			this.pagoForm.markAllAsTouched();
			this.error = 'Por favor, complete los campos requeridos.';
			return;
		}
		else if (Number(this.pagoForm.get('num_amount')?.value) <= 1) {
			this.pagoForm.markAllAsTouched();
			this.error = 'El monto a cobrar debe ser mayor a S/.1';
			return;
		}

		this.loaderService.show();

		const paymentData = {
			var_description: this.pagoForm.get('var_description')?.value,
			num_amount: Number(this.pagoForm.get('num_amount')?.value),
			num_commission: this.commission,
			num_total: this.total,
			var_email: this.pagoForm.get('var_email')?.value,
			var_admin_email: this.usuarioService.usuario.correo,
		}
		
		this.paymentService.generatePayment(paymentData).pipe(
			finalize(() => {
				this.loaderService.hide();
			})
		).subscribe({
			next: () => {
				console.log("Success");
				this.resetForm();
				this.openSuccessDialog();
			},
			error: () => {
				console.log("Error");
				this.openErrorDialog();
			}
		});
	}

	resetForm() {
		this.pagoForm.patchValue({
			var_email: '',
			var_description: '',
		});
	}

	openSuccessDialog() {
		const dialogRef = this.dialog.open(InfoDialogComponent, {
			width: '300px',
			data: {
				title: 'El pago se creó con éxito',
				message: 'Se notificará al usuario del pago generado por correo',
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			console.log("Closed");
		});
	}

	openErrorDialog() {
		const dialogRef = this.dialog.open(ErrorDialogComponent, {
			width: '300px',
			data: {
				title: 'Ocurrió un error',
				message: 'Ocurrió un error al generar el pago. Inténtelo nuevamente',
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			console.log("Closed");
		});
	}
}
