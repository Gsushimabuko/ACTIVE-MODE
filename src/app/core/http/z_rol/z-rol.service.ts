import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZRolService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getRolesParam(){
    const url = this.apiURL + "/roles/param"
    return this.http.get<any>(url)
  }

  getRolParam(id:number){
    const url = this.apiURL + "/rol/param"
    return this.http.get<any>(url,{params:{id:id}})
  }

  createRolParam(nombre:string){
    const url = this.apiURL + "/rol/param"
    const data = {nombre:nombre}
    return this.http.post<any>(url,data)
  }

  updateRolParam(nombre:string,id:number){
    const url = this.apiURL + "/rol/param/update"
    const data = {nombre:nombre,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateRolParam(id:number){
    const url = this.apiURL + "/rol/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }


}
