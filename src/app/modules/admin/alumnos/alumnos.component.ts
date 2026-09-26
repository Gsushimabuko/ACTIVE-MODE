import { Component } from '@angular/core';
import { ZMatriculaService } from '../../../core/http/z_matricula/z-matricula.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent {
  Object = Object;
  reporte! : any[]
  calendario!: any
  calendarioMes!:any
  mesSeleccionado!:string
  loader!:boolean
  fechaBuscada!:string
  diaElegido = 0
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  nombresMeses = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  private espanol = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  enEspanol(mes: string): string {
    return this.espanol[this.nombresMeses.indexOf(mes)] ?? mes
  }

  // Las semanas del calendario en una sola lista para la grilla (0 = casilla vacía).
  get diasDelMes(): number[] {
    if (!this.calendarioMes) return []
    return ['semana1', 'semana2', 'semana3', 'semana4', 'semana5', 'semana6'].flatMap((k) => this.calendarioMes[k] || [])
  }

  elegirDia(dia: number) {
    this.diaElegido = dia
    this.buscarResultadosDia(dia)
  }

  constructor(private matriculadosService: ZMatriculaService){
    this.cargarCalendario2023();
    this.cambiarMes({ value: this.nombresMeses[new Date().getMonth()] })
    
  }

  cargarCalendario2023(){
    this.loader = true
    this.calendario = this.generarCalendario(new Date().getFullYear());
    this.loader = false
  }

  generarCalendario(year: number): any {
    const meses = ["January","February","March","April","May","June",
                   "July","August","September","October","November","December"];
    const calendario: any = { year };
    for (const mes of meses) {
      const mesIndex = meses.indexOf(mes);
      const primerDia = new Date(year, mesIndex, 1).getDay();
      const diasEnMes = new Date(year, mesIndex + 1, 0).getDate();
      const semanas: number[][] = [];
      let semana: number[] = new Array(7).fill(0);
      let diaActual = 1;
      for (let i = primerDia; i < 7; i++) {
        semana[i] = diaActual++;
      }
      semanas.push(semana);
      while (diaActual <= diasEnMes) {
        semana = new Array(7).fill(0);
        for (let i = 0; i < 7 && diaActual <= diasEnMes; i++) {
          semana[i] = diaActual++;
        }
        semanas.push(semana);
      }
      while (semanas.length < 5) {
        semanas.push([0,0,0,0,0,0,0]);
      }
      calendario[mes] = semanas;
    }
    return calendario;
  }
  buscarResultadosDia(dia:number){
    this.loader = true
    let codMes
    console.log("Mes Seleccionado: ", this.mesSeleccionado)
    if(this.mesSeleccionado == "January"){
      codMes=1
    }else if (this.mesSeleccionado == "February"){
      codMes=2
    }else if (this.mesSeleccionado == "March"){
      codMes=3
    }else if (this.mesSeleccionado == "April"){
      codMes=4
    }else if (this.mesSeleccionado == "May"){
      codMes=5
    }else if (this.mesSeleccionado == "June"){
      codMes=6
    }else if (this.mesSeleccionado == "July"){
      codMes=7
    }else if (this.mesSeleccionado == "August"){
      codMes=8
    }else if (this.mesSeleccionado == "September"){
      codMes=9
    }else if (this.mesSeleccionado == "October"){
      codMes=10
    }else if (this.mesSeleccionado == "November"){
      codMes=11
    }else if (this.mesSeleccionado == "December"){
      codMes=12
    }else{
      codMes=0
    }
    console.log("DIA: ", dia, "MES: ", codMes)
    
    this.matriculadosService.getMatriculadosReporte(dia,codMes,this.calendario.year).subscribe((res) => {
      this.reporte = res
      this.loader = false
      this.fechaBuscada = dia + " de " + this.enEspanol(this.mesSeleccionado).toLowerCase() + " de " + this.calendario.year
      })
  }
  cambiarMes(mesNombreEvt:any){
    const mes = this.calendario[mesNombreEvt.value]
    this.mesSeleccionado = mesNombreEvt.value
    this.diaElegido = 0
    this.reporte = undefined as any
    const s1 = mes[0]
    const s2 = mes[1]
    const s3 = mes[2]
    const s4 = mes[3]
    const s5 = mes[4]
    this.calendarioMes = {
      semana1: s1,
      semana2: s2,
      semana3: s3,
      semana4: s4,
      semana5: s5,
      semana6: mes[5] || null
    }
  }
}
