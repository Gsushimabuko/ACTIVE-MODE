import { DiaPeriodo } from "./Dia"

export interface RatioPeriodo {
    idRatio: number
    ratio:string
    idTarifa:number
    payment:number
    state:string
    dias:DiaPeriodo[]
}