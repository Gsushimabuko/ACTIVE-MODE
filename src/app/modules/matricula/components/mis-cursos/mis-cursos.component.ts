import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { CalendarMainComponent } from 'src/app/modules/calendar/calendar-main/calendar-main.component';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.css']
})
export class MisCursosComponent {


  idUsuario:number
  mesCalendario:Date
  fechaHoy:Date
  meses:any
  loader:boolean = true
  mesForm:FormGroup
  listaCursos:any
  idPadre: number;
  usuarios!:Usuario[]

  constructor(private formBuilder: FormBuilder,
    private usuarioService: ZUsuarioService,
    private cursoService:ZCursoService) {


    this.idPadre = this.usuarioService.usuario.id
    
    this.idUsuario= this.idPadre

    this.fechaHoy = new Date() 
  
    this.mesCalendario = this.fechaHoy

    const mes = this.fechaHoy.getMonth()
    const ano = this.fechaHoy.getFullYear()

    let mesAnt
    let anoAnt

    if(mes == 0){
      anoAnt = ano - 1
      mesAnt = 11
    }else{
      anoAnt = ano
      mesAnt = mes - 1
    }

    let mesPost
    let anoPost

    if(mes == 11){
      anoPost = ano + 1
      mesPost = 0
    }else{
      anoPost = ano
      mesPost = mes + 1
    }


    this.meses =[
    {periodo_fecha: new Date(anoAnt,mesAnt,15)},
    {periodo_fecha: new Date(ano,mes,15)},
    {periodo_fecha: new Date(anoPost,mesPost,15)}
    ]
    
    /*
    this.cursoService.getMatriculaActiva().subscribe(res=>{
      this.meses=res
      console.log(res)
      this.loader = false
    })
    */

    this.mesForm = this.formBuilder.group({
      mes: [''],
      usuario:[this.idPadre]
    })

    

    this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe(res=>{
      this.listaCursos = res
      
      this.usuarioService.getRelatives(this.idPadre).subscribe(res=>{
        this.usuarios = res
        this.loader = false
  
      })
    })

  }
  
  @ViewChild('calendario') calendario!: CalendarMainComponent;

  seleccionUsuario(){
    this.loader=true
    this.idUsuario = this.mesForm.controls['usuario'].value

    this.listaCursos = []

    this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe(res=>{
      this.listaCursos = res
      this.loader=false
    })

  }

  seleccionMes(){
    this.loader=true
    this.mesCalendario = new Date(this.mesForm.controls['mes'].value)

    this.listaCursos = []

      this.cursoService.getCursosHorariosMatriculados(this.idUsuario,this.mesCalendario.getMonth(),this.mesCalendario.getFullYear()).subscribe(res=>{
        this.listaCursos = res
        this.loader=false
      })
    
  }

}
