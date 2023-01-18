import { HorarioPeriodo } from "./Horario"

export interface DiaPeriodo {
    idDias: number
    name:string
    value: number[]
    state:string
    schedule:HorarioPeriodo[]
}