import { Component, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { CalendarMainComponent } from '../../calendar/calendar-main/calendar-main.component';
import { CursoPeriodo } from '../../shared/interfaces/Curso';
import { DiaPeriodo } from '../../shared/interfaces/Dia';
import { NivelPeriodo } from '../../shared/interfaces/Nivel';
import { RatioPeriodo } from '../../shared/interfaces/Ratio';
import { ElimDialogComponent } from '../parametros/elim-dialog/elim-dialog.component';

@Component({
  selector: 'app-dialog-matricula',
  templateUrl: './dialog-matricula.component.html',
  styleUrls: ['./dialog-matricula.component.css']
})
export class DialogMatriculaComponent {

  idUsuario!:number

  cursoForm!: FormGroup
  mesForm!: FormGroup
  idTipoUsuario: number
  cursos!:CursoPeriodo[]
  curso!:CursoPeriodo
  niveles!:NivelPeriodo[]
  ratios!:RatioPeriodo[]
  dias!:DiaPeriodo[]
  flagDia:boolean=false
  tarifa:number = 0
  cantDias!:number
  usuarios!:Usuario[]
  

  
  fechaHoy:Date
  mesCalendario!:Date
  meses:any
  esEditable:boolean = true

  listaCursos:any = []
  listaCursosNuevos:any=[]
  listaCursosTotales:any =[]
  totalPagar:number = 0
  costoPagarTemporal:number = 0
  cursoPendiente:any={}
  MONTO_CURSO_DATA: any[] = [];
  cantDiasTemporal!: number;
  listaDeCursosPrecios:any = []


  loader:boolean= true

  constructor(private formBuilder: FormBuilder,
    private usuarioService: ZUsuarioService,
    private cursoService:ZCursoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any) {

    
    this.idUsuario= data.idUsuario
    
    this.idTipoUsuario = data.idTipoUsuario

    this.mesCalendario = new Date('1900-01-17T23:15:21.905Z') 

    this.fechaHoy = new Date() 

    this.cursoService.getMatriculaActiva().subscribe(res=>{

      this.meses=res
      this.loader = false
      
    })

    this.cursoForm = this.formBuilder.group({
      curso: ['', [Validators.required]],
      ratio: [{ value: '', disabled: true }, [Validators.required]],
      nivel: [{ value: '', disabled: true }, [Validators.required]],
      dia: [{ value: '', disabled: true }, [Validators.required]],
    })

    this.mesForm = this.formBuilder.group({
      mes: ['']
    })

  }

  seleccionMes(){
    this.loader=true
    this.mesCalendario = new Date(this.mesForm.controls['mes'].value)

    this.listaCursos = []
    this.listaCursosNuevos =[]
    this.listaCursosTotales =[]
    this.cursoPendiente ={}
    this.cantDiasTemporal = 0;
    this.listaDeCursosPrecios = []

    this.cursoForm.controls['curso'].setValue('')
    this.cursoForm.controls['nivel'].setValue('')
    this.cursoForm.controls['nivel'].disable()
    this.cursoForm.controls['ratio'].setValue('')
    this.cursoForm.controls['ratio'].disable()
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].disable()
  

    this.cursoService.getCursos(this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe(res=>{
      this.cursos = res

      this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe(res=>{
        this.listaCursos = res
        this.actualizarCursosCalendario()
        this.loader=false
      })

    })

  }

  ngOnInit(): void {
    
  }


  eliminarCursoMatriculado(id:number){
    
    let objeto = {
      idCursoPeriodo: id,
      idUsuario: this.idUsuario
    }

    var dialogRef = this.dialog.open(ElimDialogComponent, {
      width: '400px',
  
      hasBackdrop:true,
      data: {
        objeto: objeto,
        origen: "matriculaExtemporanea",
      }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if(result){

        this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe({
          next: res => this.listaCursos = res,
          error: error => console.log(error),
          complete: () =>{
            this.actualizarCursosCalendario()
            this.loader=false
          }
  
        })

      }

    });
    


  }

  @ViewChild('calendario') calendario!: CalendarMainComponent;

  cambioCurso(){
    
    this.loader=true
    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    this.costoPagarTemporal = 0
    this.cursoForm.controls['nivel'].setValue('')
    this.cursoForm.controls['nivel'].enable()
    this.cursoForm.controls['ratio'].setValue('')
    this.cursoForm.controls['ratio'].disable()
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].disable()

    let idPeriodoCurso = 0

    for(let curso of this.cursos){
      if(curso.idCurso == this.cursoForm.controls['curso'].value){
        idPeriodoCurso = curso.idCursoPeriodo
      }
    }

    this.cursoService.getCursoHorarios(this.idTipoUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear(),this.cursoForm.controls['curso'].value,idPeriodoCurso).subscribe(res =>{
      //console.log(res)
      if(res[0].niveles!=undefined){
        this.niveles = res[0].niveles
      }
      this.curso = res[0]
      this.loader=false
    })

    this.actualizarCursosCalendario()
  }

  cambioNivel(){

    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    this.costoPagarTemporal = 0
    this.cursoForm.controls['ratio'].setValue('')
    this.cursoForm.controls['ratio'].enable()
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].disable()
    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
         this.ratios = nivel.ratios
      }
    }

    this.actualizarCursosCalendario()
  }

  cambioRatio(){
    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    if(this.cursoForm.controls['dia'].value!=''){
      this.tarifa = 0
    }
    
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].enable()
    

    for(var ratio of this.ratios){
      if(ratio.idRatio == this.cursoForm.controls['ratio'].value){
        this.dias = ratio.dias
        this.cantDiasTemporal = ratio.dias[0].numEvents//
        this.costoPagarTemporal = ratio.payment//
      } 
    }
    
   

    this.actualizarCursosCalendario()
  }

  actualizarCursosCalendario(){
    this.listaCursosTotales = this.listaCursos.concat(this.listaCursosNuevos)
    if(this.cursoForm.controls['dia'].value!=''){
      this.listaCursosTotales.push(this.cursoPendiente)
    } 
   
  }

  eleccionDia(){

    const cupoMax = this.curso.cupoMax
    let diasEvento
    let tarifa
    let diasMax 
    let idTarifa 

    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    const nombre = this.curso.name
    const idCursoPeriodo= this.curso.idCursoPeriodo
    var horarioHoras
   
    var horarioDias

    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
        horarioHoras = nivel.time
        break
      }
    }

    for(var ratio of this.ratios){
      if(ratio.idRatio == this.cursoForm.controls['ratio'].value){
        this.dias = ratio.dias
        tarifa = ratio.payment
        idTarifa = ratio.idTarifa
      } 
    }

    for(var dia of this.dias){
      if(dia.idDias == this.cursoForm.controls['dia'].value){
        let schedule = [] //este es el horario que se envia al front
        for(var evento of dia.schedule){
          if(new Date(evento.start).getTime() > this.fechaHoy.getTime()){
            schedule.push(evento)
          }  
        }
        diasEvento = schedule
        horarioDias = dia.name
        diasMax = dia.numEvents
        break
      }
    }
    
    const curso = {idCursoPeriodo: idCursoPeriodo,nombre: nombre,horarioHoras: horarioHoras,horarioDias:horarioDias,diasEvento:diasEvento,cupoMax:cupoMax,tarifa:tarifa,diasMax:diasMax}
     
    
    //console.log(curso)

    if(this.comprobarCruce(curso)){

      let cantDias = curso.diasEvento!.length
      let montoCurso = Number((this.costoPagarTemporal*(cantDias/this.cantDiasTemporal)).toFixed(2))
      this.tarifa = montoCurso
      this.cantDias = cantDias

      this.cursoPendiente = curso
      this.flagDia = true  
      this.actualizarCursosCalendario()
    }else{
      this.cursoForm.controls['dia'].setValue('')
    }
   
    
  }

  agregarCurso(){
    const nombre = this.curso.name
    const idCursoPeriodo= this.curso.idCursoPeriodo
    const cupoMax = this.curso.cupoMax
    
    var horarioHoras
    var diasEvento
    var tarifa
    var idTarifa
    var diasMax
    var horarioDias
    
    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
        horarioHoras = nivel.time
      }
    }
    for(var dia of this.dias){
      if(dia.idDias == this.cursoForm.controls['dia'].value){
        let schedule = [] //este es el horario que se envia al front
        for(var evento of dia.schedule){
          if(new Date(evento.start).getTime() > this.fechaHoy.getTime()){
            schedule.push(evento)
          }  
        }
        diasEvento = schedule
        horarioDias = dia.name
        diasMax = dia.numEvents
      }
    }

    for(var ratio of this.ratios){
      if(ratio.idRatio == this.cursoForm.controls['ratio'].value){
        tarifa = ratio.payment
        idTarifa = ratio.idTarifa
      }
    }

    const curso = {idCursoPeriodo: idCursoPeriodo, cupoMax:cupoMax, nombre: nombre,horarioHoras: horarioHoras,horarioDias:horarioDias,diasEvento:diasEvento,tarifa:tarifa,idTarifa:idTarifa,diasMax:diasMax}
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
    this.tarifa = 0
    this.listaDeCursosPrecios = []
    this.actualizarCursosCalendario()
    this.cursoForm.invalid
    
  }

  eliminar(id:any){

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

  matricularCursos(){

    const ano = this.mesCalendario.getFullYear()
    const mes = this.mesCalendario.getMonth()

    this.cursoService.matriculaExtemporanea(this.listaCursosNuevos,this.idUsuario,ano,mes).subscribe({
      next: res => console.log(res),
      error: error => console.log(error),
      complete: () => {
        this.dialog.closeAll()
      }
    })

  }

  comprobarCruce(curso:any) : boolean{

    for(let  cursoNuevo of this.listaCursosNuevos){
      for(let horarioNuevo of cursoNuevo.diasEvento){

        for(let horarioSeleccionado of curso.diasEvento){

          let horaSelIni = new Date(horarioSeleccionado.start).getTime()
          let horaSelFin = new Date(horarioSeleccionado.end).getTime()
          let horaNueIni = new Date(horarioNuevo.start).getTime()
          let horaNueFin = new Date(horarioNuevo.end).getTime()
          //console.log(horaNueIni,horaSelIni,horaNueFin,1)
          //console.log(horaNueIni,horaSelFin,horaNueFin,2)
          if( horaSelIni < horaNueIni  && horaSelFin <= horaNueIni){
         
          }else if(horaSelFin > horaNueFin  && horaSelIni >= horaNueFin){
            
          }else{
            alert('Ya tiene seleccionado un curso con el mismo horario')  
            return false 
          }

        }

      }
    }

  
    for(let cursoNuevo of this.listaCursos){
      for(let horarioNuevo of cursoNuevo.diasEvento){

        for(let horarioSeleccionado of curso.diasEvento){

          let horaSelIni = new Date(horarioSeleccionado.start).getTime()
          let horaSelFin = new Date(horarioSeleccionado.end).getTime()
          let horaNueIni = new Date(horarioNuevo.start).getTime()
          let horaNueFin = new Date(horarioNuevo.end).getTime()
          
          //console.log(horaNueIni,horaSelIni,horaNueFin,1)
          //console.log(horaNueIni,horaSelFin,horaNueFin,2)

          if( horaSelIni < horaNueIni  && horaSelFin <= horaNueIni){
         
          }else if(horaSelFin > horaNueFin  && horaSelIni >= horaNueFin){
            
          }else{
            alert('Ya tiene seleccionado un curso con el mismo horario')  
            return false 
          }

        }

      }
    }

    return true


  }


}
