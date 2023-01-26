import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';
import { CursoPeriodo } from '../../../shared/interfaces/Curso';
import { NivelPeriodo } from '../../../shared/interfaces/Nivel';
import { RatioPeriodo } from '../../../shared/interfaces/Ratio';
import { DiaPeriodo } from '../../../shared/interfaces/Dia';
import { CalendarMainComponent } from '../../../calendar/calendar-main/calendar-main.component';

@Component({
  selector: 'app-matricula-main',
  templateUrl: './matricula-main.component.html',
  styleUrls: ['./matricula-main.component.css']
})
export class MatriculaMainComponent {

  horarios:any[] = [
    {nombre:'Solo Lunes',valor:1},
    {nombre:'Solo miércoles',valor:1},
    {nombre:'Solo viernes',valor:1},
    {nombre:'Lunes y Miércoles',valor:2},
    {nombre:'Miércoles y viernes',valor:2},
    {nombre:'Lunes y viernes',valor:2},
    {nommbre:'Lun, miér y vier',valor:3}
]

  idUsuario!:number
  cursoForm!: FormGroup
  idTipoUsuario: number
  cursos!:CursoPeriodo[]
  curso!:CursoPeriodo
  niveles!:NivelPeriodo[]
  ratios!:RatioPeriodo[]
  dias!:DiaPeriodo[]
  listaCursos:any = []
  listaCursosNuevos:any=[]
  listaCursosTotales:any = []
  flagDia:boolean=false
  cursoPendiente:any={}


  constructor(private formBuilder: FormBuilder,
    private cursoService:ZCursoService) {
    this.idUsuario=1
    this.idTipoUsuario=2

    this.cursoService.getCursosHorarios(this.idTipoUsuario).subscribe(res=>{
      console.log(res)
      this.cursos = res
    })
    this.cursoForm = this.formBuilder.group({
      curso: ['', [Validators.required]],
      ratio: [{ value: '', disabled: true }, [Validators.required]],
      nivel: [{ value: '', disabled: true }, [Validators.required]],
      dia: [{ value: '', disabled: true }, [Validators.required]],
    })

  
    this.listaCursos =[
      {idCursoPeriodo: 5,nombre:"Futbol",horario:"6:00pm - 7pm", "diasEvento": [ { "idHorario": 1, "start": "2023-01-04T23:00:00.120Z", "end": "2023-01-04T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 6, "start": "2023-01-16T23:00:00.120Z", "end": "2023-01-16T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 7, "start": "2023-01-18T23:00:00.120Z", "end": "2023-01-18T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 9, "start": "2023-01-23T23:00:00.120Z", "end": "2023-01-23T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 10, "start": "2023-01-25T23:00:00.120Z", "end": "2023-01-25T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 12, "start": "2023-01-30T23:00:00.120Z", "end": "2023-01-30T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 3, "start": "2023-01-09T23:00:00.120Z", "end": "2023-01-09T22:00:00.120Z", "number": 7, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 4, "start": "2023-01-11T23:00:00.120Z", "end": "2023-01-11T22:00:00.120Z", "number": 10, "time": "6pm - 7pm", "state": "ACTIVO" }]},
      {idCursoPeriodo: 7,nombre:"Voley",horario:"6:00pm - 7pm", "diasEvento": [ { "idHorario": 1, "start": "2023-01-04T23:00:00.120Z", "end": "2023-01-04T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 6, "start": "2023-01-16T23:00:00.120Z", "end": "2023-01-16T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 7, "start": "2023-01-18T23:00:00.120Z", "end": "2023-01-18T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 9, "start": "2023-01-23T23:00:00.120Z", "end": "2023-01-23T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 10, "start": "2023-01-25T23:00:00.120Z", "end": "2023-01-25T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 12, "start": "2023-01-30T23:00:00.120Z", "end": "2023-01-30T22:00:00.120Z", "number": 0, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 3, "start": "2023-01-09T23:00:00.120Z", "end": "2023-01-09T22:00:00.120Z", "number": 7, "time": "6pm - 7pm", "state": "ACTIVO" }, { "idHorario": 4, "start": "2023-01-11T23:00:00.120Z", "end": "2023-01-11T22:00:00.120Z", "number": 10, "time": "6pm - 7pm", "state": "ACTIVO" }]}
    ]  

    /*
    this.listaCursosNuevos =[
      {idCursoPeriodo: 8,nombre:"Futbol",horario:"6:00pm - 7pm"},
      {idCursoPeriodo: 1,nombre:"Voley",horario:"6:00pm - 7pm"},
      {idCursoPeriodo: 9,nombre:"Futbol",horario:"6:00pm - 7pm"},
    ] */
  }

  ngOnInit(): void {
    this.actualizarCursosCalendario()
  }

  @ViewChild('calendario') calendario: any;

  cambioCurso(){
    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    this.cursoForm.controls['nivel'].setValue('')
    this.cursoForm.controls['nivel'].enable()
    this.cursoForm.controls['ratio'].setValue('')
    this.cursoForm.controls['ratio'].disable()
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].disable()
    for(var curso of this.cursos){
      if(curso.idCurso == this.cursoForm.controls['curso'].value){
        this.niveles = curso.niveles
        this.curso = curso
      }   
    }  
  }

  cambioNivel(){
    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    this.cursoForm.controls['ratio'].setValue('')
    this.cursoForm.controls['ratio'].enable()
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].disable()
    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
         this.ratios = nivel.ratios
      }
    }
  }

  cambioRatio(){
    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].enable()
    for(var ratio of this.ratios){
      if(ratio.idRatio == this.cursoForm.controls['ratio'].value){
        this.dias = ratio.dias
      } 
    }
  }

  actualizarCursosCalendario(){
    this.listaCursosTotales = this.listaCursos.concat(this.listaCursosNuevos)
    if(this.cursoForm.controls['dia'].value!=''){
      this.listaCursosTotales.push(this.cursoPendiente)
    } 
  }

  eleccionDia(){

    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    const nombre = this.curso.name
    const idCursoPeriodo= this.curso.idCursoPeriodo
    var horario
    var diasEvento

    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
        horario = nivel.time
        break
      }
    }
    for(var dia of this.dias){
      if(dia.idDias == this.cursoForm.controls['dia'].value){
        diasEvento = dia.schedule
        console.log(diasEvento)
        break
      }
    }
    const curso = {idCursoPeriodo: idCursoPeriodo,nombre: nombre,horario: horario,diasEvento:diasEvento}
    this.cursoPendiente = curso
    this.flagDia = true
    this.actualizarCursosCalendario()
  }

  agregarCurso(){
    const nombre = this.curso.name
    const idCursoPeriodo= this.curso.idCursoPeriodo
    var horario
    var diasEvento
    
    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
        horario = nivel.time
      }
    }
    for(var dia of this.dias){
      if(dia.idDias == this.cursoForm.controls['dia'].value){
        diasEvento = dia.schedule
      }
    }
    const curso = {idCursoPeriodo: idCursoPeriodo,nombre: nombre,horario: horario,diasEvento:diasEvento}
    this.listaCursosNuevos.push(curso)

    this.cursoForm.controls['curso'].setValue('')
    this.cursoForm.controls['nivel'].setValue('')
    this.cursoForm.controls['nivel'].disable()
    this.cursoForm.controls['ratio'].setValue('')
    this.cursoForm.controls['ratio'].disable()
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].disable()
    this.cursoForm.controls['curso'].setErrors(null)

    this.cursoPendiente = {}
    this.actualizarCursosCalendario()
  }

  eliminar(id:any){
    console.log(id,"id del padre")
    const lista = this.listaCursosNuevos
    for (let i = 0; i < lista.length; i++) {
      if(this.listaCursosNuevos[i].idCursoPeriodo == id){
        lista.splice(i,1)
        this.listaCursosNuevos = lista
        break
      }
    }
    this.actualizarCursosCalendario()
  }
  
  
  
}
