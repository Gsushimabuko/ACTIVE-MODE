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

  constructor(private matriculadosService: ZMatriculaService){
    this.cargarCalendario2023();
    
  }

  cargarCalendario2023(){
    this.loader = true
  
    this.calendario = {
        "year": 2025,
        "January": [[0,0,0,1,2,3,4],[5,6,7,8,9,10,11],[12,13,14,15,16,17,18],[19,20,21,22,23,24,25],[26,27,28,29,30,31,0]],
        "February": [[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,0]],
        "March": [[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,29],[30,31,0,0,0,0,0]],
        "April": [[0,0,1,2,3,4,5],[6,7,8,9,10,11,12],[13,14,15,16,17,18,19],[20,21,22,23,24,25,26],[27,28,29,30,0,0,0]],
        "May": [[0,0,0,0,1,2,3],[4,5,6,7,8,9,10],[11,12,13,14,15,16,17],[18,19,20,21,22,23,24],[25,26,27,28,29,30,31]],
        "June": [[1,2,3,4,5,6,7],[8,9,10,11,12,13,14],[15,16,17,18,19,20,21],[22,23,24,25,26,27,28],[29,30,0,0,0,0,0]],
        "July": [[0,0,1,2,3,4,5],[6,7,8,9,10,11,12],[13,14,15,16,17,18,19],[20,21,22,23,24,25,26],[27,28,29,30,31,0,0]],
        "August": [[0,0,0,0,0,1,2],[3,4,5,6,7,8,9],[10,11,12,13,14,15,16],[17,18,19,20,21,22,23],[24,25,26,27,28,29,30],[31,0,0,0,0,0,0]],
        "September": [[0,1,2,3,4,5,6],[7,8,9,10,11,12,13],[14,15,16,17,18,19,20],[21,22,23,24,25,26,27],[28,29,30,0,0,0,0]],
        "October": [[0,0,0,1,2,3,4],[5,6,7,8,9,10,11],[12,13,14,15,16,17,18],[19,20,21,22,23,24,25],[26,27,28,29,30,31,0]],
        "November": [[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,29],[30,0,0,0,0,0,0]],
        "December": [[0,1,2,3,4,5,6],[7,8,9,10,11,12,13],[14,15,16,17,18,19,20],[21,22,23,24,25,26,27],[28,29,30,31,0,0,0]]
      };

    this.loader = false

  
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
    
    this.matriculadosService.getMatriculadosReporte(dia,codMes,2025).subscribe((res) => {
      this.reporte = res
      this.loader = false
      this.fechaBuscada = dia.toString()+ " " + this.mesSeleccionado + "  " + '2025'
      })
  }
  cambiarMes(mesNombreEvt:any){
    const mes = this.calendario[mesNombreEvt.value]
    this.mesSeleccionado = mesNombreEvt.value
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
      semana5:s5
    }
  }
}
