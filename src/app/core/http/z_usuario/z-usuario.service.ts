import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
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

  getRelatives(idUsuario: number): Observable<Usuario[]>  {
    return this.http.get<Usuario[]>(this.API_URL + '/familiares',{params:{idUsuario:idUsuario}})
  }


  createUsuario(persona: any): Observable<any>  {
    return this.http.post<any>(this.API_URL + '/registro', persona)
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
            id_tipo_usuario: resp.id_rol
          }
          
        }
        
      }),//Tap hace que se ejecute esa acción primero
      map(resp => resp.ok),//map transforma la respuesta solo a ok
      catchError( err => {return of(false)})//si hay un errpr devuelve false
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
            id_tipo_usuario: resp.id_rol
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
            id_tipo_usuario: resp.id_rol
          } 
        }

  
      }),//Tap hace que se ejecute esa acción primero
      map(resp => resp.ok),//map transforma la respuesta solo a ok
      catchError( err => {return of(false)})//si hay un errpr devuelve false
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
            id_tipo_usuario: resp.id_rol
          }

          //console.log("USUARIO ROL ID: ",this._usuario.id_rol)

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



}
