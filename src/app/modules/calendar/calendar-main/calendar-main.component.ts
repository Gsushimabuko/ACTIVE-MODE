import { Component, Input, SimpleChanges } from '@angular/core';
import { DiaPeriodo } from '../../shared/interfaces/Dia';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrls: ['./calendar-main.component.css']
})
export class CalendarMainComponent {

  @Input() listaCursosTotales:any = []
  talleres: any[];
  HORARIO_DATA: any[] = [];

  constructor() {
    this.generadorCalendarioMes()
    this.horarios = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
    };

    this.talleres = [];
  }
  
  minPixelRatio = 1.25;

  ngOnInit(): void {

      this.actualizarHorario();

  
    //console.log(this.horarios)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("entro")
    this.actualizarHorario();
  }

  actualizarHorario() {

    if(this.listaCursosTotales[0].idCursoPeriodo!=undefined){
      this.horarios = {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
      };
  
      console.log(this.listaCursosTotales)
  
      for(var curso of this.listaCursosTotales){
        console.log(curso)
        for(var dia of curso.diasEvento){
          let diaMes = new Date(dia.start).getDay()
          console.log(diaMes)
        }
      }
  
      for (let dia of this.dias) {
        let startPixel = 0;
        let color = 0;
  
        if (dia == 'martes' || dia == 'jueves') {
          color = 3;
        }
        else {
          color = 0;
        }
  
        for(let taller of this.talleres) {
          if (!taller.horario[dia].includes('')) {
            const min = this.parseHoraStringToNumber(taller.horario[dia][0]);
            const max = this.parseHoraStringToNumber(taller.horario[dia][1]);
  
            taller.duracion = max - min;
            taller.pixels = taller.duracion/this.minPixelRatio;
  
            taller.minPixel = (min - 60*7)/this.minPixelRatio - startPixel;
            startPixel += taller.pixels;
            taller.color = this.colores[color];
            color += 1;
  
            this.horarios[dia].push(taller);
          }
        }
      }

    }

    
  }


  displayedColumns: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  
  horarios: any;

  dias: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  colores: string[] = [
    'rgb(252, 192, 0)',
    'rgb(244, 110, 108)',
    'rgb(186, 148, 221)',
    'rgb(0, 192, 122)',
    'rgb(71, 66, 184)',
    'rgb(97, 97, 97)',
    'rgb(255, 40, 0)',
    'rgb(0, 153, 233)',
    'rgb(255, 212, 81)',
    'rgb(105, 193, 125)',
    'rgb(231, 114, 125)',
    'rgb(252, 192, 0)',
    'rgb(244, 110, 108)',
    'rgb(186, 148, 221)',
    'rgb(0, 192, 122)',
    'rgb(71, 66, 184)',
    'rgb(97, 97, 97)',
    'rgb(255, 40, 0)',
    'rgb(0, 153, 233)',
    'rgb(255, 212, 81)',
    'rgb(105, 193, 125)',
    'rgb(231, 114, 125)',
  ]

  generadorCalendarioMes(){
    var calendarioMes = []
    const fechaHoy = new Date()
    const diasMes = new Date(fechaHoy.getFullYear(),fechaHoy.getMonth()+1,0).getDate()
    let semana = {}  as { [key: string]: number}
    for(let i = 1; i < diasMes+1; i++){
      let dia = new Date(fechaHoy.getFullYear(),fechaHoy.getMonth(),i).getDay()
      if(dia==0){
        if(i==1){
          //no pasa nada 
        }else{
          calendarioMes.push(semana)
          semana={} as { [key: string]: number}
        }
      }else{
        switch (dia) {
          case 1:
            semana['lunes'] = i
            break;         
          case 2:
            semana['martes'] = i
            break;
          case 3:
            semana['miercoles'] = i
            break;        
          case 4:
            semana['jueves'] = i
            break;
          case 5:
            semana['viernes'] = i
            break;
          default:
            break;
        }
      } 
    }
    calendarioMes.push(semana)
    this.HORARIO_DATA = calendarioMes
  }

  parseHoraStringToNumber(hora: string) {
    if (hora == '') {
      return 10000;
    }
    let times = hora.split(':');
    let minutes = (parseInt(times[0], 10) * 60) + (parseInt(times[1], 10));
    return minutes;
  }

}
