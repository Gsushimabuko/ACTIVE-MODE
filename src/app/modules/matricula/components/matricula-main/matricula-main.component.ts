import { Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';
import { CursoPeriodo } from '../../../shared/interfaces/Curso';
import { NivelPeriodo } from '../../../shared/interfaces/Nivel';
import { RatioPeriodo } from '../../../shared/interfaces/Ratio';
import { DiaPeriodo } from '../../../shared/interfaces/Dia';
import { CalendarMainComponent } from '../../../calendar/calendar-main/calendar-main.component';
import { HorarioPeriodo } from '../../../shared/interfaces/Horario';
import { CursoListaComponent } from '../curso-lista/curso-lista.component';
import { ZUsuarioService } from '../../../../core/http/z_usuario/z-usuario.service';
import { ResultadoPago } from '../../../pasarela/pasarela.component';
import { CursoComponent } from '../curso/curso.component';
import { Usuario } from '../../../../interfaces/usuario';
import { MatDialog } from '@angular/material/dialog';
import { TycDialogComponent } from '../tyc-dialog/tyc-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModoAccesoService } from '../../../../core/acceso/modo-acceso.service';
import { crearFormInvitado, tipoUsuarioPorRelacion } from '../datos-invitado/datos-invitado.component';
import { PasarelaService } from '../../../../core/http/pasarela/pasarela.service';
import { Subscription, interval, of } from 'rxjs';
import { switchMap, take, catchError } from 'rxjs/operators';

interface BorradorMatricula {
  version: 1
  guardadoEn: number
  periodo: string
  idUsuario: number | null
  invitado: any
  cursoForm: any
  cursos: any[]
  resultado?: ResultadoPago
}


@Component({
  selector: 'app-matricula-main',
  templateUrl: './matricula-main.component.html',
  styleUrls: ['./matricula-main.component.css']
})
export class MatriculaMainComponent implements OnDestroy {

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
  

  extra:number
  fechaHoy:Date
  mesCalendario!:Date
  meses:any
  paso: 1 | 2 | 3 = 1

  listaCursos:any = []
  listaCursosNuevos:any=[]
  listaCursosTotales:any =[]
  totalPagar:number = 0
  costoPagarTemporal:number = 0
  cursoPendiente:any={}
  cantDiasTemporal!: number;
  listaDeCursosPrecios:any = []
  resultado?: ResultadoPago
  private pollingPagoSub?: Subscription
  private cambiosSub = new Subscription()
  private borradorPendiente?: BorradorMatricula
  private borradorListo = false
  private restaurandoBorrador = false
  private pasoSolicitado: string | null = null


  loader:boolean= true
  // Sin sesión solo se llega aquí en modo invitado (ValidarTokenGuard).
  invitado: boolean
  invitadoForm: FormGroup
  faltanDatosInvitado = false
  idPadre: number;
  idTipoPadre: number;
  // Curso elegido en su ficha ("Matricularme"): se selecciona solo cuando cargan los cursos del periodo.
  cursoPreseleccionado: number | null = null


  constructor(private formBuilder: FormBuilder,
    private usuarioService: ZUsuarioService,
    private cursoService:ZCursoService,
    public dialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
    public snackbar: MatSnackBar,
    private modo: ModoAccesoService,
    private pasarelaService: PasarelaService
    ) {

    this.invitado = !this.usuarioService.usuario.id
    this.invitadoForm = crearFormInvitado(this.formBuilder)

    this.idPadre = this.usuarioService.usuario.id
    
    this.idUsuario= this.idPadre

    this.idTipoPadre =  this.usuarioService.usuario.id_tipo_usuario
    
    this.idTipoUsuario = this.idTipoPadre

    this.mesCalendario = new Date('1900-01-17T23:15:21.905Z') 

    this.fechaHoy = new Date()
    this.extra = 15*60*1000 // prorroga:  (+) aumenta prorroga, (-) disminuye prorroga 

    this.cursoForm = this.formBuilder.group({
      curso: ['', [Validators.required]],
      ratio: [{ value: '', disabled: true }, [Validators.required]],
      nivel: [{ value: '', disabled: true }, [Validators.required]],
      dia: [{ value: '', disabled: true }, [Validators.required]],
    })

    this.mesForm = this.formBuilder.group({
      mes: [''],
      usuario:[this.idPadre]
    })

    this.cambiosSub.add(this.invitadoForm.valueChanges.subscribe(() => this.guardarBorrador()))
    this.cambiosSub.add(this.cursoForm.valueChanges.subscribe(() => this.guardarBorrador()))
    this.cambiosSub.add(this.route.queryParamMap.subscribe(params => {
      this.pasoSolicitado = params.get('paso')
      if (this.borradorListo) this.aplicarPasoSolicitado()
    }))

    this.cursoService.getMatriculaActiva().subscribe(res=>{
      this.meses=res

      if (this.invitado) {
        this.inicializarFormulario()
        return
      }
      this.usuarioService.getRelatives(this.idPadre).subscribe(res=>{
        this.usuarios = res
        this.inicializarFormulario()
      })
    })

  }

  private get borradorKey(): string {
    return `active-mode:matricula:${this.invitado ? 'invitado' : this.idPadre}`
  }

  private leerBorrador(): BorradorMatricula | undefined {
    try {
      const guardado = sessionStorage.getItem(this.borradorKey)
      if (!guardado) return undefined
      const borrador = JSON.parse(guardado) as BorradorMatricula
      if (borrador.version !== 1 || Date.now() - borrador.guardadoEn > 12 * 60 * 60 * 1000) {
        sessionStorage.removeItem(this.borradorKey)
        return undefined
      }
      return borrador
    } catch {
      return undefined
    }
  }

  private inicializarFormulario() {
    const borrador = this.leerBorrador()
    if (borrador?.periodo && (this.meses ?? []).some((m: any) => m.periodo_fecha === borrador.periodo)) {
      this.restaurandoBorrador = true
      this.borradorPendiente = borrador
      if (this.invitado) {
        this.invitadoForm.patchValue(borrador.invitado || {}, { emitEvent: false })
        this.idTipoUsuario = tipoUsuarioPorRelacion(this.invitadoForm.value.relacion)
      } else {
        const usuario = (this.usuarios ?? []).find(u => Number(u.id) === Number(borrador.idUsuario))
        if (usuario) {
          this.mesForm.controls['usuario'].setValue(usuario, { emitEvent: false })
          this.idUsuario = usuario.id
          this.idTipoUsuario = usuario.id_tipo_usuario
        }
      }
      this.mesForm.controls['mes'].setValue(borrador.periodo, { emitEvent: false })
      this.borradorListo = true
      this.seleccionMes()
      return
    }

    this.borradorListo = true
    this.preseleccionarPeriodo()
    if (this.mesForm.controls['mes'].value === '') this.loader = false
    this.aplicarPasoSolicitado()
  }

  private guardarBorrador() {
    if (!this.borradorListo || this.restaurandoBorrador) return
    const periodo = this.mesForm?.controls['mes']?.value
    if (!periodo) return
    const usuario = this.mesForm.controls['usuario'].value
    const borrador: BorradorMatricula = {
      version: 1,
      guardadoEn: Date.now(),
      periodo,
      idUsuario: this.invitado ? null : Number(usuario?.id || this.idUsuario || 0),
      invitado: this.invitado ? this.invitadoForm.getRawValue() : null,
      cursoForm: this.cursoForm.getRawValue(),
      cursos: this.listaCursosNuevos,
      resultado: this.resultado,
    }
    try { sessionStorage.setItem(this.borradorKey, JSON.stringify(borrador)) } catch { }
  }

  private limpiarBorrador() {
    try { sessionStorage.removeItem(this.borradorKey) } catch { }
  }

  private finalizarCargaPeriodo() {
    const borrador = this.borradorPendiente
    if (!borrador) {
      this.restaurandoBorrador = false
      this.guardarBorrador()
      return
    }

    this.borradorPendiente = undefined
    this.listaCursosNuevos = Array.isArray(borrador.cursos) ? borrador.cursos : []
    this.resultado = borrador.resultado
    this.actualizarCursosCalendario()
    this.restaurarSeleccionCurso(borrador.cursoForm)
    this.restaurandoBorrador = false
    this.aplicarPasoSolicitado()
    if (this.resultado?.estado === 'pendiente') this.consultarConfirmacionPago(this.resultado.chargeId)
    this.guardarBorrador()
  }

  private restaurarSeleccionCurso(valores: any) {
    if (!valores?.curso || !this.cursos?.some(c => c.idCurso == valores.curso)) return
    const cursoListado = this.cursos.find(c => c.idCurso == valores.curso)!
    this.cursoForm.controls['curso'].setValue(valores.curso, { emitEvent: false })
    this.loader = true
    this.cursoService.getCursoHorarios(
      this.idTipoUsuario,
      this.mesCalendario.getMonth(),
      this.mesCalendario.getFullYear(),
      valores.curso,
      cursoListado.idCursoPeriodo,
    ).subscribe(res => {
      this.curso = res[0]
      this.niveles = res[0]?.niveles || []
      this.cursoForm.controls['nivel'].enable({ emitEvent: false })
      if (this.niveles.some(n => n.idNivel == valores.nivel)) {
        this.cursoForm.controls['nivel'].setValue(valores.nivel, { emitEvent: false })
        this.ratios = this.niveles.find(n => n.idNivel == valores.nivel)?.ratios || []
        this.cursoForm.controls['ratio'].enable({ emitEvent: false })
      }
      if (this.ratios?.some(r => r.idRatio == valores.ratio)) {
        const ratio = this.ratios.find(r => r.idRatio == valores.ratio)!
        this.cursoForm.controls['ratio'].setValue(valores.ratio, { emitEvent: false })
        this.dias = ratio.dias
        this.cantDiasTemporal = ratio.dias[0]?.numEvents || 0
        this.costoPagarTemporal = ratio.payment
        this.cursoForm.controls['dia'].enable({ emitEvent: false })
      }
      if (this.dias?.some(d => d.idDias == valores.dia)) {
        this.cursoForm.controls['dia'].setValue(valores.dia, { emitEvent: false })
        this.eleccionDia()
      }
      this.loader = false
    })
  }
  


  seleccionUsuario(){
    this.loader=true
    this.idUsuario = this.mesForm.controls['usuario'].value.id
    this.idTipoUsuario =  this.mesForm.controls['usuario'].value.id_tipo_usuario
    
    this.listaCursos = []
    this.listaCursosNuevos =[]
    this.listaCursosTotales =[]
    this.totalPagar = 0
    this.costoPagarTemporal = 0
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
        this.aplicarCursoPreseleccionado()
        this.finalizarCargaPeriodo()
      })

    })

  }

  seleccionMes(){
    this.loader=true
    this.mesCalendario = new Date(this.mesForm.controls['mes'].value)

    this.listaCursos = []
    this.listaCursosNuevos =[]
    this.listaCursosTotales =[]
    this.totalPagar = 0
    this.costoPagarTemporal = 0
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

      // El invitado no tiene matrículas previas que mostrar en el calendario.
      if (this.invitado) {
        this.actualizarCursosCalendario()
        this.loader=false
        this.aplicarCursoPreseleccionado()
        this.finalizarCargaPeriodo()
        return
      }
      this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe(res=>{
        this.listaCursos = res
        this.actualizarCursosCalendario()
        this.loader=false
        this.aplicarCursoPreseleccionado()
        this.finalizarCargaPeriodo()
      })

    })

  }

  // Invitado: la relación con el colegio define la tarifa, así que lo elegido con otra relación deja de valer.
  cambioRelacion() {
    this.idTipoUsuario = tipoUsuarioPorRelacion(this.invitadoForm.value.relacion)
    this.listaCursosNuevos = []
    this.cursoPendiente = {}
    this.flagDia = false
    this.tarifa = 0
    this.cursoForm.reset({ curso: '', nivel: '', ratio: '', dia: '' })
    for (const c of ['nivel', 'ratio', 'dia']) this.cursoForm.controls[c].disable()
    this.actualizarCursosCalendario()
    this.aplicarCursoPreseleccionado()
    this.guardarBorrador()
  }

  // Viene de la ficha del curso con ?periodo=<fecha>&idCurso=<id>: elige ese periodo si tiene matrícula abierta.
  private preseleccionarPeriodo() {
    const q = this.route.snapshot.queryParamMap
    const idCurso = Number(q.get('idCurso'))
    const pedido = new Date(q.get('periodo') ?? '')
    if (!idCurso || isNaN(pedido.getTime())) return
    const mes = (this.meses ?? []).find((m: any) => {
      const f = new Date(m.periodo_fecha)
      return f.getFullYear() === pedido.getFullYear() && f.getMonth() === pedido.getMonth()
    })
    if (!mes) return
    this.cursoPreseleccionado = idCurso
    this.mesForm.controls['mes'].setValue(mes.periodo_fecha)
    this.seleccionMes()
  }

  // Elige el curso de la ficha si está en el periodo y abierto. El invitado antes elige su relación, que define la tarifa.
  private aplicarCursoPreseleccionado() {
    if (!this.cursoPreseleccionado || !this.cursos) return
    if (this.invitado && !this.invitadoForm.value.relacion) return
    const curso = this.cursos.find((c) => c.idCurso === this.cursoPreseleccionado && c.state !== 'CERRADO')
    if (!curso) return
    this.cursoForm.controls['curso'].setValue(curso.idCurso)
    this.cambioCurso()
  }

  agregar() {
    if (this.invitado && this.invitadoForm.invalid) {
      this.invitadoForm.markAllAsTouched()
      this.faltanDatosInvitado = true
      return
    }
    this.faltanDatosInvitado = false
    this.agregarCurso()
  }

  ngOnInit(): void {
    
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
      //console.log(res[0].hayTarifa)
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
    this.calcularMontoCurso()
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
          if(new Date(evento.start).getTime() > (this.fechaHoy.getTime() - this.extra)){
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
          if(new Date(evento.start).getTime() > (this.fechaHoy.getTime() - this.extra)){
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
    if (this.cursoYaSeleccionado(idCursoPeriodo)) {
      this.openSnackBar('El alumno ya está matriculado o ya agregó este curso para el periodo seleccionado.', 5)
      return
    }
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
    this.guardarBorrador()
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
    this.guardarBorrador()
  }

  comprobarCruce(curso:any) : boolean{

    if (this.cursoYaSeleccionado(curso.idCursoPeriodo)) {
      this.openSnackBar('El alumno ya está matriculado o ya agregó este curso para el periodo seleccionado.', 5)
      return false
    }

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

  elegirNivel(id: number) {
    this.cursoForm.controls['nivel'].setValue(id)
    this.cambioNivel()
  }

  elegirRatio(id: number) {
    this.cursoForm.controls['ratio'].setValue(id)
    this.cambioRatio()
  }

  elegirDia(id: number) {
    this.cursoForm.controls['dia'].setValue(id)
    this.eleccionDia()
  }

  get nombreAlumno(): string {
    if (this.invitado) return `${this.invitadoForm.value.nombre} ${this.invitadoForm.value.apellidop}`.trim()
    const alumno = this.mesForm?.controls['usuario'].value
    return alumno && typeof alumno === 'object' ? `${alumno.nombre} ${alumno.apellidop}` : ''
  }

  cursoYaSeleccionado(idCursoPeriodo: number): boolean {
    return [...this.listaCursos, ...this.listaCursosNuevos]
      .some(curso => Number(curso.idCursoPeriodo) === Number(idCursoPeriodo))
  }

  irAPago() {
    if (!this.listaCursosNuevos.length) return
    this.paso = 2
    this.guardarBorrador()
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { paso: 'pago' },
      queryParamsHandling: 'merge',
    })
  }

  volverAFormulario() {
    this.paso = 1
    this.guardarBorrador()
    this.actualizarPasoUrl(null, true)
  }

  reintentarPago() {
    this.paso = 2
    this.guardarBorrador()
    this.actualizarPasoUrl('pago', true)
  }

  private actualizarPasoUrl(paso: string | null, replaceUrl: boolean) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { paso },
      queryParamsHandling: 'merge',
      replaceUrl,
    })
  }

  private aplicarPasoSolicitado() {
    if (this.pasoSolicitado === 'estado' && this.resultado) {
      this.paso = 3
    } else if (this.pasoSolicitado === 'pago' && this.listaCursosNuevos.length) {
      this.paso = 2
    } else {
      this.paso = 1
    }
  }

  // La pantalla "pendiente" no ofrece volver atrás: otro "Pagar" crearía un segundo cargo.
  mostrarResultado(resultado: ResultadoPago) {
    this.resultado = resultado
    if (this.invitado && resultado.estado === 'pendiente') this.modo.guardarDatosParaRegistro(this.invitadoForm.getRawValue())
    this.paso = 3
    this.actualizarPasoUrl('estado', true)
    this.guardarBorrador()
    if (resultado.estado === 'pendiente') this.consultarConfirmacionPago(resultado.chargeId)
  }

  // Cobrana confirma el pago de forma asíncrona (webhook); mientras el usuario ve "pendiente",
  // consultamos cada 4s si ya llegó esa confirmación, hasta 3 minutos.
  private consultarConfirmacionPago(chargeId: string) {
    this.pollingPagoSub?.unsubscribe()
    this.pollingPagoSub = interval(4000).pipe(
      switchMap(() => this.pasarelaService.estadoPago(chargeId).pipe(catchError(() => of({ pagado: false })))),
      take(45),
    ).subscribe(({ pagado }) => {
      if (pagado) {
        this.resultado = { estado: 'exitoso' }
        this.pollingPagoSub?.unsubscribe()
        this.limpiarBorrador()
      }
    })
  }

  ngOnDestroy(): void {
    this.guardarBorrador()
    this.pollingPagoSub?.unsubscribe()
    this.cambiosSub.unsubscribe()
  }

  verTerminos() {
    this.dialog.open(TycDialogComponent)
  }


  calcularMontoCurso(){
    let total = 0

    this.listaDeCursosPrecios = this.listaCursosNuevos

    for(let [i,curso] of this.listaDeCursosPrecios.entries()){
      let diasMax = curso.diasMax
      let costoMes = curso.tarifa
      
      let cantDias = curso.diasEvento.length
      let montoCurso = Number((costoMes*(cantDias/diasMax)).toFixed(2))

      this.listaDeCursosPrecios[i].monto = montoCurso

      total = total + montoCurso
    }

    this.totalPagar = total
  }

  openSnackBar(message: string, seconds: number) {
    this.snackbar.open(message, 'X', {
      duration: seconds * 1000,
    });
  }
  
}
