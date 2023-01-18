import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';

@Injectable({
  providedIn: 'root'
})
export class ZCursoService {

  apiURL = environment.API_URL

  constructor(private http: HttpClient) { }

  getCursosHorarios(idTipoUsuario:number){
    const url = this.apiURL + "/cursos_horarios"
    console.log(url)
    return this.http.get<CursoPeriodo[]>(url,{params:{idTipoUsuario: idTipoUsuario}})
  }

}
