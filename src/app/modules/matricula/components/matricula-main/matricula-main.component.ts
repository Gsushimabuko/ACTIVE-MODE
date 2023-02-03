import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';
import { CursoPeriodo } from '../../../shared/interfaces/Curso';
import { NivelPeriodo } from '../../../shared/interfaces/Nivel';
import { RatioPeriodo } from '../../../shared/interfaces/Ratio';
import { DiaPeriodo } from '../../../shared/interfaces/Dia';
import { CalendarMainComponent } from '../../../calendar/calendar-main/calendar-main.component';
import { MatStepper } from '@angular/material/stepper';
import { HorarioPeriodo } from '../../../shared/interfaces/Horario';
import { CursoListaComponent } from '../curso-lista/curso-lista.component';
import { ZUsuarioService } from '../../../../core/http/z_usuario/z-usuario.service';
import { PasarelaComponent } from '../../../pasarela/pasarela.component';


@Component({
  selector: 'app-matricula-main',
  templateUrl: './matricula-main.component.html',
  styleUrls: ['./matricula-main.component.css']
})
export class MatriculaMainComponent {

  idUsuario!:number
  cursoForm!: FormGroup
  mesForm!: FormGroup
  idTipoUsuario: number
  cursos!:CursoPeriodo[]
  curso!:CursoPeriodo
  niveles!:NivelPeriodo[]
  ratios!:RatioPeriodo[]
  dias!:DiaPeriodo[]
  listaCursos:any = []
  listaCursosNuevos:any=[]
  listaCursosTotales:any =[]
  flagDia:boolean=false
  cursoPendiente:any={}
  MONTO_CURSO_DATA: any[] = [];
  totalPagar:number = 0
  costoPagarTemporal:number = 0
  fechaHoy:Date
  mesCalendario!:Date
  idPago:number = 1 //HARCODEADO
  meses:any
  listaDeCursosPrecios:any = []
  esEditable:boolean = true
  cantDiasTemporal: any;


  constructor(private formBuilder: FormBuilder,
    private usuarioService: ZUsuarioService,
    private cursoService:ZCursoService) {

  
    this.idUsuario= this.usuarioService.usuario.id
    this.idTipoUsuario=  this.usuarioService.usuario.id_tipo_usuario

    this.mesCalendario = new Date('1900-01-17T23:15:21.905Z') 

    this.fechaHoy = new Date() 

    this.cursoService.getMatriculaActiva().subscribe(res=>{
      this.meses=res
    })

    this.cursoForm = this.formBuilder.group({
      curso: ['', [Validators.required]],
      ratio: [{ value: '', disabled: true }, [Validators.required]],
      nivel: [{ value: '', disabled: true }, [Validators.required]],
      dia: [{ value: '', disabled: true }, [Validators.required]],
    })

    this.mesForm = this.formBuilder.group({
      mes: [''],
    })

  }

  seleccionMes(){
    this.mesCalendario = new Date(this.mesForm.controls['mes'].value)

    console.log(this.idTipoUsuario)

    this.cursoService.getCursosHorarios(this.idTipoUsuario,this.mesCalendario).subscribe(res=>{
      this.cursos = res
      
    
      this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario).subscribe(res=>{
        this.listaCursos = res
        this.actualizarCursosCalendario()
      })

    })
  }

  ngOnInit(): void {
    
  }

  @ViewChild('calendario') calendario: any;

  cambioCurso(){
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
    for(var curso of this.cursos){
      if(curso.idCurso == this.cursoForm.controls['curso'].value){
        this.niveles = curso.niveles
        this.curso = curso
      }   
    }  

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
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].enable()
    

    for(var ratio of this.ratios){
      if(ratio.idRatio == this.cursoForm.controls['ratio'].value){
        this.dias = ratio.dias
        this.cantDiasTemporal = ratio.dias[0].numEvents
        this.costoPagarTemporal = ratio.payment
      } 
    }

    this.actualizarCursosCalendario()
  }

  actualizarCursosCalendario(){
    this.listaCursosTotales = this.listaCursos.concat(this.listaCursosNuevos)
    if(this.cursoForm.controls['dia'].value!=''){
      this.listaCursosTotales.push(this.cursoPendiente)
    } 
    this.calcularMontoCurso()
  }

  eleccionDia(){

    if(this.flagDia){
      this.listaCursosTotales.pop()
      this.flagDia = false
    }
    const nombre = this.curso.name
    const idCursoPeriodo= this.curso.idCursoPeriodo
    var horarioHoras
    var diasEvento
    var horarioDias

    for(var nivel of this.niveles){
      if(nivel.idNivel == this.cursoForm.controls['nivel'].value){
        horarioHoras = nivel.time
        break
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
        break
      }
    }
    
    const curso = {idCursoPeriodo: idCursoPeriodo,nombre: nombre,horarioHoras: horarioHoras,horarioDias:horarioDias,diasEvento:diasEvento}

    if(this.comprobarCruce(curso)){
      this.cursoPendiente = curso
      console.log(curso)
      this.flagDia = true
      this.actualizarCursosCalendario()
    }else{
      this.cursoForm.controls['dia'].setValue('')
    }
   
    
  }

  agregarCurso(){
    const nombre = this.curso.name
    const idCursoPeriodo= this.curso.idCursoPeriodo
    
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

    const curso = {idCursoPeriodo: idCursoPeriodo,nombre: nombre,horarioHoras: horarioHoras,horarioDias:horarioDias,diasEvento:diasEvento,tarifa:tarifa,idTarifa:idTarifa,diasMax:diasMax}
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

  comprobarCruce(curso:any) : boolean{

    for(let  cursoNuevo of this.listaCursosNuevos){
      for(let horarioNuevo of cursoNuevo.diasEvento){

        for(let horarioSeleccionado of curso.diasEvento){

          let horaSelIni = new Date(horarioSeleccionado.start).getTime()
          let horaSelFin = new Date(horarioSeleccionado.end).getTime()
          let horaNueIni = new Date(horarioNuevo.start).getTime()
          let horaNueFin = new Date(horarioNuevo.end).getTime()
          console.log(horaNueIni,horaSelIni,horaNueFin,1)
          console.log(horaNueIni,horaSelFin,horaNueFin,2)
          if( horaSelIni < horaNueIni  && horaSelFin <= horaNueIni){
         
          }else if(horaSelFin > horaNueFin  && horaSelIni >= horaNueFin){
            
          }else{
            alert('cruce')  
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
          
          console.log(horaNueIni,horaSelIni,horaNueFin,1)
          console.log(horaNueIni,horaSelFin,horaNueFin,2)

          if( horaSelIni < horaNueIni  && horaSelFin <= horaNueIni){
         
          }else if(horaSelFin > horaNueFin  && horaSelIni >= horaNueFin){
            
          }else{
            alert('cruce')  
            return false 
          }

        }

      }
    }

    return true


  }

  nextStep(stepper: MatStepper) {
  
    stepper.next();
  }

  realizarPago(stepper: MatStepper){
    this.esEditable=false
    stepper.next();
  }

  matricula(stepper: MatStepper){

    //matricula
    /*
    
      this.cursoService.createMatriculaHorario(this.listaDeCursosPrecios,this.idPago,this.idUsuario).subscribe(res=>{
        console.log(res)
      })  

    */
    

    stepper.next();
  }


  calcularMontoCurso(){
    let orden = 1
    let listaCalculada =[]
    let total = 0

    this.listaDeCursosPrecios = this.listaCursosNuevos

    for(var curso of this.listaDeCursosPrecios){
      let diasMax = curso.diasMax
      let costoMes = curso.tarifa
      
      let cantDias = curso.diasEvento.length
      let montoCurso = Number((costoMes*(cantDias/diasMax)).toFixed(2))
      listaCalculada.push({
        orden: orden,
        curso: curso.nombre + " " + curso.horarioDias + " " + curso.horarioHoras,
        dias:cantDias,
        monto: montoCurso
      })

      total = total + montoCurso
      orden = orden + 1
    }

    this.totalPagar = total
  
    this.MONTO_CURSO_DATA = listaCalculada
  }

  displayedColumns: string[] = ['orden','curso', 'dias', 'monto'];
  
  
  
}
