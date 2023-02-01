import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { CursoPeriodo,CursoMatriculado } from 'src/app/modules/shared/interfaces/Curso';

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

  getCursosHorariosMatriculados(idUsuario:number,fechaReferencial:Date){
    const url = this.apiURL + "/cursos_horarios_matriculados"
    console.log(fechaReferencial.toString())
    return this.http.get<CursoMatriculado[]>(url,{params:{idUsuario: idUsuario, fechaReferencial: fechaReferencial.toString()}})
  }
  

  createMatriculaHorario(curso:any,idPago:number,idUsuario:number){
    const url = this.apiURL + "/cursos_matricula"
    const data = {
      curso:curso,
      idPago:idPago,
      idUsuario:idUsuario
    }
    return this.http.post<any>(url,data)
  }

}
