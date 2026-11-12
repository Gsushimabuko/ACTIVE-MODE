import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

// Datos que Cobrana exige de quien paga.
export interface ClientePago {
	dni: string;
	nombre: string;
	apellido: string;
}

@Injectable({
	providedIn: 'root'
})
export class UPaymentService {
	private readonly API_URL = environment.API_URL;

	constructor(private readonly _http: HttpClient) { }

	public generatePayment(paymentData: any) {
		return this._http.post(`${this.API_URL}/payment`, { paymentData });
	}

	// Crea el cargo en Cobrana (backend) y devuelve el link de la pasarela.
	public cobrar(paymentUuid: string, cliente: ClientePago | null) {
		return this._http.post<{ ok: boolean; paymentUrl: string; chargeId: string }>(`${this.API_URL}/payment/${paymentUuid}/cobrana`, { cliente });
	}

	public getPaymentData(paymentUuid: string) {
		return this._http.get(`${this.API_URL}/payment/${paymentUuid}`);
	}
}
