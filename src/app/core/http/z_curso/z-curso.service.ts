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

  getCursosHorarios(idTipoUsuario:number,mes:number,ano:number){
    const url = this.apiURL + "/cursos_horarios"
    return this.http.get<CursoPeriodo[]>(url,{params:{idTipoUsuario: idTipoUsuario, mes:mes, ano:ano}})
  }

  getCursos(mes:number,ano:number){
    const url = this.apiURL + "/cursos"
    return this.http.get<CursoPeriodo[]>(url,{params:{mes:mes, ano:ano}})
  }

  getCursoHorarios(idTipoUsuario:number,mes:number,ano:number,idCurso:number,idCursoPeriodo:number){
    const url = this.apiURL + "/cursos_horariosv2"
    return this.http.get<CursoPeriodo[]>(url,{params:{idTipoUsuario: idTipoUsuario, mes:mes, ano:ano,idCurso:idCurso,idCursoPeriodo:idCursoPeriodo}})
  }

  getCursosHorariosMatriculados(idUsuario:number,mes:number, ano:number){
    const url = this.apiURL + "/cursos_horarios_matriculados"
    return this.http.get<CursoMatriculado[]>(url,{params:{idUsuario: idUsuario, mes:mes, ano:ano}})
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

  getMatriculaActiva(){
    const url = this.apiURL + "/matricula_activa"
    return this.http.get<any>(url)
  }

  getOnlyCursos(){
    const url = this.apiURL + "/curso-only"
    return this.http.get<any>(url)

  }

  getOnlyCursoPeriodo (idCurso: number){
    const url = this.apiURL + "/curso-periodo-only"
    return this.http.get<any>(url,{params:{idCurso:idCurso}})

  }
  getOnlyHorario(idCursoPeriodo:number){
    const url = this.apiURL + "/horario-only"
    return this.http.get<any>(url,{params:{idCursoPeriodo:idCursoPeriodo}})


  }
  getOnlyAlumnosHorario(idHorario:number){
    const url = this.apiURL + "/horario-alumnos-only"
    return this.http.get<any>(url,{params:{idHorario:idHorario}})
  }
}
