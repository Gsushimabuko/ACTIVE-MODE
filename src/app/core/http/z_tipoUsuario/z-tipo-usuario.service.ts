import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZTipoUsuarioService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getTipoUsuariosParam(){
    const url = this.apiURL + "/tipo-usuarios/param"
    return this.http.get<any>(url)
  }

  getTipoUsuarioParam(id:number){
    const url = this.apiURL + "/tipo-usuario/param"
    return this.http.get<any>(url,{params:{id:id}})
  }

  createTipoUsuarioParam(nombre:string){
    const url = this.apiURL + "/tipo-usuario/param"
    const data = {nombre:nombre}
    return this.http.post<any>(url,data)
  }

  updateTipoUsuarioParam(tipoUsuario:any,id:number){
    const url = this.apiURL + "/tipo-usuario/param/update"
    const data = {nombre:tipoUsuario.nombre,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateTipoUsuarioParam(id:number){
    const url = this.apiURL + "/tipo-usuario/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

  deleteTipoUsuarioParam(id:number){
    const url = this.apiURL + "/tipo-usuario/param"
    return this.http.delete<any>(url,{params:{id:id}})
  }

}
