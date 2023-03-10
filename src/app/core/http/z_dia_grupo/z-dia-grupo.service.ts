import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZDiaGrupoService {
  getDiasParam() {
    throw new Error('Method not implemented.');
  }

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getDiasGrupoParam(){
    const url = this.apiURL + "/dias-grupo/param"
    return this.http.get<any>(url)
  }

  getDiaGrupoParam(id:number){
    const url = this.apiURL + "/dia-grupo/param"
    return this.http.get<any>(url,{params:{id:id}})
  }

  createDiaGrupoParam(nombre:string,valor:string,idDia:number){
    const url = this.apiURL + "/dia-grupo/param"
    const data = {nombre:nombre,valor:valor,idDia:idDia}
    return this.http.post<any>(url,data)
  }

  updateDiaGrupoParam(diaGrupo:any,id:number){
    const url = this.apiURL + "/dia-grupo/param/update"
    const data = {nombre:diaGrupo.nombre,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateDiaGrupoParam(id:number){
    const url = this.apiURL + "/dia-grupo/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

  deleteDiaGrupoParam(id:number){
    const url = this.apiURL + "/dia-grupo/param"
    return this.http.delete<any>(url,{params:{id:id}})
  }
}
