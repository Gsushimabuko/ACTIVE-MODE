import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

export interface CargoCreado {
  ok: boolean;
  paymentUrl: string;
  chargeId: string;
}

// Datos del alumno cuando se matricula sin cuenta (el backend los valida igual).
export interface DatosInvitado {
  nombre: string;
  apellidop: string;
  apellidom?: string;
  dni: string;
  correo: string;
  telefono?: string;
  relacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasarelaService {
  private API_URL = environment.API_URL + '/charge';

  constructor(private _http: HttpClient) { }

  createPayment(monto: number, cursos: any, idUsuario: number, ano: number, mes: number, invitado: DatosInvitado | null = null) {
    const payment = { amount: monto, description: 'Pago de matrícula a talleres de Active Mode' };
    const alumno = invitado ? { invitado } : { idUsuario };
    return this._http.post<CargoCreado>(this.API_URL, { payment, cursos, ...alumno, ano, mes });
  }
}
