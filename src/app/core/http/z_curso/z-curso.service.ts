import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { CursoPeriodo,CursoMatriculado } from 'src/app/modules/shared/interfaces/Curso';
import { CursoParam } from '../../../modules/shared/interfaces/Curso';

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


  //PARAMS

  getCursosParam(){
    const url = this.apiURL + "/cursos/param"
    return this.http.get<CursoParam[]>(url)
  }

  getCursoParam(id:number){
    const url = this.apiURL + "/curso/param"
    return this.http.get<CursoParam>(url,{params:{id:id}})
  }

  createCursoParam(nombre:string){
    const url = this.apiURL + "/curso/param"
    const data = {nombre:nombre}
    return this.http.post<any>(url,data)
  }

  updateCursoParam(curso:any,idCurso:number){
    const url = this.apiURL + "/curso/param/update"
    const data = {nombre:curso.nombre,idCurso:idCurso}
    return this.http.put<any>(url,data)
  }

  updateCursoPeriodoParam(cursoPeriodo: any, id: number){
    const url = this.apiURL + "/curso-periodo/param/update"
    const data = { profesor: cursoPeriodo.profesor, cupo_max: cursoPeriodo.cupo_max, id: id}
    return this.http.put<any>(url,data)
  }

  changeStateCursoParam(idCurso:number){
    const url = this.apiURL + "/curso/param/state"
    const data = {idCurso:idCurso}
    return this.http.put<any>(url,data)
  }

  changeStateCursoPeriodo(id: number){
    const url = this.apiURL + "/curso-periodo/param/state"
    const data = {id: id}
    return this.http.put<any>(url, data)
  }

  deleteCursoParam(id:number){
    const url = this.apiURL + "/curso/param"
    return this.http.delete<any>(url,{params:{id:id}})
  }

  deleteCursoPeriodo(id: number){
    const url = this.apiURL + "/curso-periodo";
    return this.http.delete<any>(url,{ body: { id: id } });
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

  createCursoPeriodo (cursoPeriodo: any, tarifas: any, niveles: any) {
    const url = this.apiURL + "/curso-periodo";
    return this.http.post<any>(url, {
      cursoPeriodo: cursoPeriodo,
      tarifas: tarifas,
      niveles: niveles
    });
  }

  duplicateCursoPeriodo(periodo: any, periodoAnt: any) {
    const url = this.apiURL + "/curso-periodo-duplicado";
    return this.http.post<any>(url, {
      periodo: periodo,
      periodoAnt: periodoAnt,
    });
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

  getCursoPeriodo (mes: number, ano: number){
    const url = this.apiURL + "/curso-periodo";
    return this.http.get<any>(url, { params: { mes: mes, ano: ano } });
  }

  getOnlyHorario(idCursoPeriodo:number){
    const url = this.apiURL + "/horario-only"
    return this.http.get<any>(url,{params:{idCursoPeriodo:idCursoPeriodo}})
  }

  getOnlyAlumnosHorario(idHorario:number){
    const url = this.apiURL + "/horario-alumnos-only"
    return this.http.get<any>(url,{params:{idHorario:idHorario}})
  }

  inactiveMatriculaExtemporanea(idCursoPeriodo:number,idUsuario:number){
    const url = this.apiURL + "/curso/matricula/delete"
    const data={
      idCursoPeriodo:idCursoPeriodo,idUsuario :idUsuario
    }
    return this.http.put<any>(url,data)
  }

  matriculaExtemporanea(cursos:any,idUsuario:number, ano:number,mes:number){
    const url = this.apiURL + "/curso/matricula/create"
    const data={ cursos:cursos, idUsuario:idUsuario, ano:ano, mes:mes }
    return this.http.post<any>(url,data)
  }
}
