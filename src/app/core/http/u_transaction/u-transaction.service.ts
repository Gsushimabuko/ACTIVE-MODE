import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UTransactionService {
  private readonly API_URL = environment.API_URL;

  constructor(private readonly _http: HttpClient) { }

  public getTransaction(transactionUuid: string) {
    return this._http.get(`${this.API_URL}/transaction/${transactionUuid}`);
  }
}
