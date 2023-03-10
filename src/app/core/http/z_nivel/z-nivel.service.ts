import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZNivelService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getNivelesParam(){
    const url = this.apiURL + "/niveles/param"
    return this.http.get<any>(url)
  }

  getNivelParam(id:number){
    const url = this.apiURL + "/nivel/param"
    return this.http.get<any>(url,{params:{id:id}})
  }

  createNivelParam(nivel:string,hora:string){
    const url = this.apiURL + "/nivel/param"
    const data = {nivel:nivel,hora:hora}
    return this.http.post<any>(url,data)
  }

  updateNivelParam(nivel:any,id:number){
    const url = this.apiURL + "/nivel/param/update"
    const data = {nivel:nivel.nivel,hora:nivel.hora,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateNivelParam(id:number){
    const url = this.apiURL + "/nivel/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

  deleteNivelParam(id:number){
    const url = this.apiURL + "/nivel/param"
    return this.http.delete<any>(url,{params:{id:id}})
  }


}
