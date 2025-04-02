import { Component, Input } from '@angular/core';
import { NiubizService } from 'src/app/core/http/niubiz/niubiz.service';
import { ScriptService } from 'src/app/core/scripts/script.service';
import { environment } from 'src/app/environments/environment';

@Component({
	selector: 'app-boton-pago',
	templateUrl: './boton-pago.component.html',
	styleUrls: ['./boton-pago.component.css']
})
export class BotonPagoComponent {
	@Input() uuid: string = '';
	pago: any = {};
	accessToken: any = {};

	constructor(
		private readonly niubizService: NiubizService,
		private readonly script: ScriptService,
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
		this.openForm();
	}

	openForm() {
		if (!this.uuid) {
			console.log('No se ha recibido el uuid');
			return;
		}

		this.niubizService.generateSessionToken(this.uuid)
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
					};

					VisanetCheckout.configuration.complete = (data: any) => {
						console.log(data);
						alert(data)
						
						this.niubizService.payPayment(this.pago.var_uuid, data).subscribe({
							next: (data: any) => {
								console.log(data);
							},
							error: (error: any) => {
								console.log(error);
							},
						});
					};

					VisanetCheckout.open();
				},
				error: (error: any) => {
					console.log(error);
				},
			}
		);
	}
}
