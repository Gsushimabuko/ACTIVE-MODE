import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NiubizService } from 'src/app/core/http/niubiz/niubiz.service';
import { ScriptService } from 'src/app/core/scripts/script.service';
import { environment } from 'src/app/environments/environment';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { LoaderService } from '../loaderService/loader.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-boton-pago',
	templateUrl: './boton-pago.component.html',
	styleUrls: ['./boton-pago.component.css']
})
export class BotonPagoComponent {
	@Output() clicked = new EventEmitter<void>();

	@Input() uuid: string = '';
	@Input() token: string = '';
	@Input() disabled = false;
	pago: any = {};
	accessToken: any = {};

	constructor(
		private readonly niubizService: NiubizService,
		private readonly script: ScriptService,
		private readonly loaderService: LoaderService,
		private readonly dialog: MatDialog,
		private readonly router: Router,
	) {
		this.configurePayGate();
	}

	configurePayGate() {
		this.script
			.load('niubiz')
			.then((data) => {
				console.log('Script loaded');
			})
			.catch((error) => {
				console.log('Script not loaded');
			});
	}

	pay() {
		this.clicked.emit();
		
		if (this.disabled) return;
		this.openForm();
	}

	openForm() {
		if (!this.uuid) {
			console.log('No se ha recibido el uuid');
			return;
		}

		this.loaderService.show();

		this.niubizService.generateSessionToken(this.uuid, this.token)
			.subscribe({
				next: (data: any) => {
					this.accessToken = data.data;
					this.pago = data.paymentData;
					this.pago.num_total = parseFloat(this.pago.num_total);

					console.log(data);

					VisanetCheckout.configure({
						sessiontoken: this.accessToken.sessionKey,
						channel: 'web',
						merchantid: environment.MERCHANT_ID,
						purchasenumber: `${this.pago.var_uuid}`,
						amount: this.pago.num_total,
						expirationminutes: '20',
						timeouturl: 'about:blank',
						merchantlogo: 'img/niubiz.png',
						formbuttoncolor: '#000000',
						action: 'payment',
					});

					VisanetCheckout.configuration.cancel = () => {
						console.log('Cancel');
						this.loaderService.hide();
					};

					VisanetCheckout.configuration.complete = (data: any) => {
						console.log(data);

						this.niubizService.payPayment(this.pago.var_uuid, data).subscribe({
							next: (data: any) => {
								this.loaderService.hide();
								this.router.navigate([`/transaccion/${data.transactionUuid}`]);
							},
							error: (error: any) => {
								console.log(error);
								
								let errorMessage: string = '';
								if (error.status == 500) {
									errorMessage = 'Ha ocurrido un error en nuestros servidores. No se ha realizado ningún pago desde su tarjeta. \nPor favor, inténtelo otra vez. \nLa página se refrescará en 5 segundos.'
									
									this.openErrorDialog(errorMessage);
									this.refreshInFive();
									return;
								}

								this.loaderService.hide();
								this.router.navigate([`/transaccion/${error.error.transactionUuid}`]);
							},
						});
					};

					VisanetCheckout.open();
				},
				error: (error: any) => {
					console.log(error);
					this.loaderService.hide();
				},
			}
			);
	}


	openSuccessDialog() {
		const dialogRef = this.dialog.open(InfoDialogComponent, {
			width: '300px',
			data: {
				title: 'El pago se realizó con éxito',
				message: 'Se ha enviado un correo de confirmación del pago',
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			console.log("Closed");
		});
	}

	openErrorDialog(error: string) {
		const dialogRef = this.dialog.open(ErrorDialogComponent, {
			width: '300px',
			data: {
				title: 'Ocurrió un error',
				message: error,
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			console.log("Closed");
		});
	}

	refreshInFive() {
		setTimeout(() => {
			location.reload();
		}, 5000);
	}
}