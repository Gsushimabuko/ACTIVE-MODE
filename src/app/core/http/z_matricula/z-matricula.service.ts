import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Usuario } from 'src/app/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class ZMatriculaService {

  API_URL = environment.API_URL;
  
  
  constructor(private http: HttpClient) {}


  getMatriculadosReporte(dia: number, mes: number, ano:number): Observable<Usuario[]>  {
    return this.http.get<Usuario[]>(this.API_URL + '/test-funcion',{params:{mes:mes, dia:dia, ano:ano}})
  }

  getFullYear2023() :  Observable<any[]> {
    return this.http.get<any[]>('https://calendar-json-api.up.railway.app/fullyear')
  }

}
