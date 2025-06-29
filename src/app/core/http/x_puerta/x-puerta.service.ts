import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  checkAsistenciaAK(body: any){
    return this.http.post<any>(this.API_URL + "/AK"  , body)
  }
  checkAsistenciaExterno(body: any){
    return this.http.post<any>(this.API_URL + "/externo" , body)
  }
  createRegistroCSV(body: any): Observable<any> {
    return this.http.post(this.API_URL + "/evento" , body)
  }

  getRegistrosIndex(inicio:any,fin:any){
    return this.http.get<any>(this.API_URL + "/index" , {params:{inicio:inicio, fin:fin}})
  }
  getRegistrosIndexReporte(body:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers,
      responseType: 'blob' as 'json'
    };

    return this.http.post<Blob>(this.API_URL+'/reporte', body, options);

  }

 
}
