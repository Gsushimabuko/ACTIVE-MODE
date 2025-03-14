import { Component, HostListener, Input, SimpleChanges } from '@angular/core';
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
  listaCursosModificados:any=[]
  innerWidth: any;
  @Input() mesCalendario!: Date

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  constructor() {
    this.talleres = [];
  }
  
  minPixelRatio = 1.25;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;  
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.actualizarHorario();  
  }

  actualizarHorario() {
    this.generadorCalendarioMes()
    
    if(this.listaCursosTotales[0]!=undefined){
      var color = 0
      var horariosCurso = []   
      var cursosEvento = []     

      for(var curso of this.listaCursosTotales){
        let cursoDatos = {
          nombre: curso.nombre,
          horario : curso.horarioDias + " - " + curso.horarioHoras,
          color: this.colores[color],
          eventos: [] as any
        }
        color += 1;
        for(var dia of curso.diasEvento){
          let diaMes = new Date(dia.start).getDate()
          cursoDatos.eventos.push(diaMes)
        }
        horariosCurso.push(cursoDatos)  

        for(var semana of this.HORARIO_DATA){
          let diasSemana = Object.keys(semana)
          for(var diaSem of diasSemana){
            if(cursoDatos.eventos.includes(semana[diaSem].dia)){
              let datosEvento = {
                nombre: cursoDatos.nombre,
                color: cursoDatos.color
              }
              semana[diaSem].cursos.push(datosEvento)
            }
          }
        }

        cursosEvento.push(cursoDatos)
      }

      this.listaCursosModificados= cursosEvento
      
    }else{
      this.listaCursosModificados =[]
    }
  }

  displayedColumns: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  
  horarios: any;

  dias: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
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
    if(this.mesCalendario){
      var calendarioMes = []
      const fechaHoy = this.mesCalendario
      const diasMes = new Date(fechaHoy.getFullYear(),fechaHoy.getMonth()+1,0).getDate()
      let semana = {}  as any
      for(let i = 1; i < diasMes+1; i++){
        let dia = new Date(fechaHoy.getFullYear(),fechaHoy.getMonth(),i).getDay()
        if(dia==0){
          semana['domingo'] = {dia:i,cursos:[]}
          calendarioMes.push(semana)
          semana={} as any
        }else{
          switch (dia) {
            case 1:
              semana['lunes'] = {dia:i,cursos:[]}
              break;         
            case 2:
              semana['martes'] = {dia:i,cursos:[]}
              break;
            case 3:
              semana['miercoles'] = {dia:i,cursos:[]}
              break;        
            case 4:
              semana['jueves'] = {dia:i,cursos:[]}
              break;
            case 5:
              semana['viernes'] = {dia:i,cursos:[]}
              break;
            case 6:
              semana['sabado'] = {dia:i,cursos:[]}
              break;
            default:
              break;
          }
        } 
      }
      if(Object.keys(semana).length > 0){
        calendarioMes.push(semana)
      }
      this.HORARIO_DATA = calendarioMes
    }
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