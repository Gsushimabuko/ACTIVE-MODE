import { HorarioMatriculado } from './Horario';
import { NivelPeriodo } from './Nivel';

export interface CursoPeriodo {
    idCurso: number
    name:string
    description:string
    idCursoPeriodo:number
    instructor:string
    month:string
    dateMat:Date
    year:number
    state:string
    cupoMax:number
    niveles:NivelPeriodo[]
}

export interface CursoParam {
    id: number
    nombre:string
    estado:string
}

export interface CursoMatriculado {
    horarioHoras: string
    nombre:string
    horarioDias:string
    diasEvento:HorarioMatriculado[]
}