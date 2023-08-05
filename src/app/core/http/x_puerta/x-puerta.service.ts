import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class XPuertaService {

  API_URL = environment.API_URL + '/puerta/registros';

  constructor(private http: HttpClient) {}

  checkAsistencia(body: any){
    return this.http.post<any>(this.API_URL , body)
  }

}
