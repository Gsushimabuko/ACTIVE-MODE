import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UPaymentService {
	private readonly API_URL = environment.API_URL;

	constructor(private readonly _http: HttpClient) { }

	public generatePayment(paymentData: any) {
		return this._http.post(`${this.API_URL}/payment`, { paymentData });
	}

	public getPaymentStatus(paymentUuid: string) {
		return this._http.get(`${this.API_URL}/payment/${paymentUuid}/status`);
	}
}
