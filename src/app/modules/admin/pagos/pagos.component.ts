import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UPaymentService } from 'src/app/core/http/u_payment/u-payment.service';

@Component({
	selector: 'app-pagos',
	templateUrl: './pagos.component.html',
	styleUrls: ['./pagos.component.css'],
})
export class PagosComponent {
	pagoForm: FormGroup = new FormGroup({
		var_description: new FormControl('', [Validators.required]),
		num_amount: new FormControl(0, [Validators.required]),
		num_commission_percentage: new FormControl(0.1, [Validators.required]),
		var_email: new FormControl('', [Validators.required, Validators.email]),
	});

	commission: number = 0;
	total: number = 0;

	error: string = '';

	constructor(private readonly paymentService: UPaymentService) {}

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

		const paymentData = {
			var_description: this.pagoForm.get('var_description')?.value,
			num_amount: Number(this.pagoForm.get('num_amount')?.value),
			num_commission: this.commission,
			num_total: this.total,
			var_email: this.pagoForm.get('var_email')?.value,
		}
		console.log(paymentData);
		this.paymentService.generatePayment(paymentData).subscribe({
			next: () => {
				alert('Pago generado correctamente.');
			},
			error: () => {
				alert('Ocurrió un error al generar el pago.');
			}
		});
	}
}
