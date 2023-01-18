import { RatioPeriodo } from './Ratio';
export interface NivelPeriodo {
    idNivel: number
    name:string
    time:string
    state:string
    ratios:RatioPeriodo[]
}