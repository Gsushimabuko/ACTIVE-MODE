import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Usuario } from 'src/app/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class ZUsuarioService {

  API_URL = environment.API_URL;
  private _usuario! : Usuario
  
  constructor(private http: HttpClient) {}

  get usuario(){
    return {...this._usuario}
  }

  getUsuariosFiltros(nombre:string,apellidop:string,apellidom:string,dni:string){
    return this.http.get<Usuario[]>(this.API_URL + '/filtros',{params:{nombre:nombre,apellidop:apellidop,apellidom:apellidom,dni:dni}, headers: this.authHeaders()})
  }

  getRelatives(idUsuario: number): Observable<Usuario[]>  {
    return this.http.get<Usuario[]>(this.API_URL + '/familiares', {
      params: { idUsuario },
      headers: this.authHeaders(),
    })
  }


  createUsuario(persona: any): Observable<any>  {
    return this.http.post<any>(this.API_URL + '/registro', persona)
  }
  createRelativo(persona: any): Observable<any>  {
    return this.http.post<any>(this.API_URL + '/relativo', persona, { headers: this.authHeaders() })
  }

  updateRelativo(id: number, persona: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/familiares/${id}`, persona, { headers: this.authHeaders() })
  }

  deleteRelativo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/familiares/${id}`, { headers: this.authHeaders() })
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders().set('jwt', localStorage.getItem('jwt') || '')
  }

  login(usuario: any) {
    const url =  this.API_URL + '/login'
    return this.http.post<any>(url, usuario)
    .pipe(
      tap( resp => {
        if (resp.ok == true){
          localStorage.setItem('jwt',  resp.token)
          this._usuario = {
            id:  resp.id, 
            correo: resp.correo,
            nombre: resp.nombre,
            apellidop: resp.apellidop,
            apellidom: resp.apellidom,
            telefono: resp.telefono,
            dni: resp.dni,
            dob: resp.dob,
            sexo:  resp.sexo,
            direccion: resp.direccion,
            estado: resp.estado,
            id_rol: resp.id_rol,
            id_tipo_usuario: resp.id_tipo_usuario
          }
          
        }
        
      }),//Tap hace que se ejecute esa acción primero
      map(resp => resp.ok),//map transforma la respuesta solo a ok
      catchError(err => err.status === 403 || err.status === 404 ? of(false) : throwError(() => err))
    )
  }

  validarToken() :Observable<boolean> {
    const url = environment.API_URL  + '/renovar'
    const headers = new HttpHeaders()
    .set('jwt', localStorage.getItem('jwt') || '')
    return this.http.get<any>(url, {headers})
    .pipe(
      
      map( resp => {
        
        //console.log("RESP ", resp )
        localStorage.setItem('token', resp.token)
        
          this._usuario = {
            id:  resp.id, 
            correo: resp.correo,
            nombre: resp.nombre,
            apellidop: resp.apellidop,
            apellidom: resp.apellidom,
            telefono: resp.telefono,
            dni: resp.dni,
            dob: resp.dob,
            sexo:  resp.sexo,
            direccion: resp.direccion,
            estado: resp.estado,
            id_rol: resp.id_rol,
            id_tipo_usuario: resp.id_tipo_usuario
          }

          return resp.ok;
        }),
        catchError((err) =>  { 
          //console.log(err)
          return of(false) })
  )}

  loginAdmin(usuario: any) {
    const url =  this.API_URL + '/login'
    return this.http.post<any>(url, usuario)
    .pipe(
      tap( resp => {
        if (resp.ok == true){
          localStorage.setItem('jwt',  resp.token)
          this._usuario = {
            id:  resp.id, 
            correo: resp.correo,
            nombre: resp.nombre,
            apellidop: resp.apellidop,
            apellidom: resp.apellidom,
            telefono: resp.telefono,
            dni: resp.dni,
            dob: resp.dob,
            sexo:  resp.sexo,
            direccion: resp.direccion,
            estado: resp.estado,
            id_rol: resp.id_rol,
            id_tipo_usuario:resp.id_tipo_usuario
          } 
        }

  
      }),//Tap hace que se ejecute esa acción primero
      map(resp => resp.ok),//map transforma la respuesta solo a ok
      catchError(err => err.status === 403 || err.status === 404 ? of(false) : throwError(() => err))
    )
  }

  validarTokenAdmin() :Observable<boolean> {
    const url = environment.API_URL  + '/renovar'
    const headers = new HttpHeaders()
    .set('jwt', localStorage.getItem('jwt') || '')
    return this.http.get<any>(url, {headers})
    .pipe(
      
      map( resp => {
        
        //console.log("RESP ", resp )
        localStorage.setItem('token', resp.token)
        
          this._usuario = {
            id:  resp.id, 
            correo: resp.correo,
            nombre: resp.nombre,
            apellidop: resp.apellidop,
            apellidom: resp.apellidom,
            telefono: resp.telefono,
            dni: resp.dni,
            dob: resp.dob,
            sexo:  resp.sexo,
            direccion: resp.direccion,
            estado: resp.estado,
            id_rol: resp.id_rol,
            id_tipo_usuario: resp.id_tipo_usuario
          }

          //console.log("USUARIO ROL ID: ",this._usuario.id_rol)
            //console.log("PUERTA")
          if(this._usuario.id_rol == 3){
            //console.log("USUARIO ADMINISTRADOR")
            return resp.ok;
          }

          if(this._usuario.id_rol == 2){
            //console.log("USUARIO ADMINISTRADOR")
            return resp.ok;
          } else {
            //console.log("USUARIO NORMAL")
            return of(false)
          }

        }),
        catchError((err) =>  { 
          //console.log(err)
          return of(false) })
  )}

  enviarCorreoContrasena(correo: any) {
    return this.http.post<any>(this.API_URL + '/recuperar-cuenta', correo)
  }

  cambiarContrasena(contrasena: any, token: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.API_URL + '/cambiar-contrasena', contrasena, { headers: headers });
  }


}
