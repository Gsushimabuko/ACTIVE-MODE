import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZPeriodoService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getPeriodosParam(){
    const url = this.apiURL + "/periodos/param"
    return this.http.get<any>(url)
  }

  getPeriodoParam(id:number){
    const url = this.apiURL + "/periodo/param"
    return this.http.get<any>(url,{params:{id:id}})
  }

  getPeriodoTiempos() {
    const url = this.apiURL + "/periodo/tiempos";
    return this.http.get<any>(url);
  }

  createPeriodoParam(mes:number,ano:number){
    const url = this.apiURL + "/periodo/param"
    const data = {mes:mes,ano:ano}
    return this.http.post<any>(url,data)
  }

  changeStatePeriodoParam(id:number){
    const url = this.apiURL + "/periodo/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

  deletePeriodoParam(id:number){
    const url = this.apiURL + "/periodo/param"
    return this.http.delete<any>(url,{params:{id:id}})
  }

}
