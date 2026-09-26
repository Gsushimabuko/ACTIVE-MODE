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
    hayTarifa:boolean
    niveles:NivelPeriodo[]
    // Ficha del curso (z_curso). Pueden venir vacíos si el colegio no los llenó.
    image?: string | null
    category?: string | null
    ages?: string | null
    tagline?: string | null
    plan?: { titulo: string; detalle: string }[]
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