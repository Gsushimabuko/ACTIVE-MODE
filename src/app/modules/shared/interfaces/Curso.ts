import { NivelPeriodo } from './Nivel';

export interface CursoPeriodo {
    idCurso: number
    name:string
    description:string
    idCursoPeriodo:number
    instructor:string
    month:string
    year:number
    state:string
    niveles:NivelPeriodo[]
}