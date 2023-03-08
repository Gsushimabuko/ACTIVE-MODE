import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZTipoUsuarioService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getTipoUsuarioAll(){
    const url = this.apiURL + "/tipo-usuario/param"
    return this.http.get<any>(url)
  }

  createTipoUsuario(nombre:string){
    const url = this.apiURL + "/tipo-usuario/param"
    const data = {nombre:nombre}
    return this.http.post<any>(url,data)
  }

  updateTipoUsuario(nombre:string,id:number){
    const url = this.apiURL + "/tipo-usuario/param/update"
    const data = {nombre:nombre,id:id}
    return this.http.put<any>(url,data)
  }

  changeStateTipoUsuario(id:number){
    const url = this.apiURL + "/tipo-usuario/param/state"
    const data = {id:id}
    return this.http.put<any>(url,data)
  }

}
