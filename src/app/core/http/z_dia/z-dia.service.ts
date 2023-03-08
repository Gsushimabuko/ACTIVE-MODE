import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZDiaService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getDiasParam(){
    const url = this.apiURL + "/dias/param"
    return this.http.get<any>(url)
  }

  getDiaParam(id:number){
    const url = this.apiURL + "/dia/param"
    return this.http.get<any>(url,{params:{id:id}})
  }

  createDiaParam(dias_semana:string,dias_tarifa:number){
    const url = this.apiURL + "/dia/param"
    const data = {dias_semana:dias_semana,dias_tarifa:dias_tarifa}
    return this.http.post<any>(url,data)
  }

  updateDiaParam(dias_semana:string,dias_tarifa:number,id:number){
    const url = this.apiURL + "/dia/param/update"
    const data = {dias_semana:dias_semana,dias_tarifa:dias_tarifa,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateDiaParam(id:number){
    const url = this.apiURL + "/dia/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

  
}
