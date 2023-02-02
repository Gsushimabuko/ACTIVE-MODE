import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasarelaService {
  private API_URL = environment.API_URL + '/charge';

  constructor(private _http: HttpClient) { }

  createPayment(paymentData: any) {
    return this._http.post(this.API_URL, { payment: paymentData });
  }
}
