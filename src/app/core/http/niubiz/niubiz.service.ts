import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class NiubizService {
	private readonly API_URL = environment.API_URL;

	constructor(private readonly _http: HttpClient) { }

	public generarCompra(idCompra: number, transactionData: any) {
		return this._http.post(`${this.API_URL}/test2/${idCompra}`, { transactionData  });
	}

	public generateSessionToken(paymentUuid: string, token: string) {
		return this._http.post(`${this.API_URL}/payment/session?token=${token}`, { uuid: paymentUuid });
	}

	public payPayment(paymentUuid: string, transactionData: any) {
		return this._http.post(`${this.API_URL}/payment/${paymentUuid}/pay`, { transactionData });
	}
}
