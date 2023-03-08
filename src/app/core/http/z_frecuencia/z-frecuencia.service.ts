import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZFrecuenciaService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getFrecuenciaAll(){
    const url = this.apiURL + "/frecuencia/param"
    return this.http.get<any>(url)
  }

  createFrecuencia(nombre:string){
    const url = this.apiURL + "/frecuencia/param"
    const data = {nombre:nombre}
    return this.http.post<any>(url,data)
  }

  updateFrecuencia(nombre:string,id:number){
    const url = this.apiURL + "/frecuencia/param/update"
    const data = {nombre:nombre,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateFrecuencia(id:number){
    const url = this.apiURL + "/frecuencia/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

}
