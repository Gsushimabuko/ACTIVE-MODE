import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZCodigoService {

  API_URL = environment.API_URL;
 
  
  constructor(private http: HttpClient) {}


  createCodigo(body: any): Observable<any>  {
    return this.http.post<any>(this.API_URL + '/codigo/check', body)
  }

  checkCodigo(codigo: any): Observable<any>  {
    return this.http.get<any>(this.API_URL + '/codigo/check', {params:{codigo:codigo}})
  }


}
