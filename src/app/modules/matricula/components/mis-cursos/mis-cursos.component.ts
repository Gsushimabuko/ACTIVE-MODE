import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
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

  constructor(private formBuilder: FormBuilder,
    private usuarioService: ZUsuarioService,
    private cursoService:ZCursoService) {

    this.idUsuario= this.usuarioService.usuario.id

    this.fechaHoy = new Date() 
  
    this.mesCalendario = this.fechaHoy

    this.cursoService.getMatriculaActiva().subscribe(res=>{
      this.meses=res
      this.loader = false
    })

    this.mesForm = this.formBuilder.group({
      mes: [''],
    })




  }
  
  @ViewChild('calendario') calendario!: CalendarMainComponent;


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
