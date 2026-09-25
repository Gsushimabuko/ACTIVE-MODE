import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

export interface CargoCreado {
  ok: boolean;
  paymentUrl: string;
  chargeId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasarelaService {
  private API_URL = environment.API_URL + '/charge';

  constructor(private _http: HttpClient) { }

  createPayment(monto: number, cursos: any, idUsuario: number, ano: number, mes: number) {
    const payment = { amount: monto, description: 'Pago de matrícula a talleres de Active Mode' };
    return this._http.post<CargoCreado>(this.API_URL, { payment, cursos, idUsuario, ano, mes });
  }
}
