import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';
import { CursoPeriodo } from '../../../shared/interfaces/Curso';
import { NivelPeriodo } from '../../../shared/interfaces/Nivel';
import { RatioPeriodo } from '../../../shared/interfaces/Ratio';
import { DiaPeriodo } from '../../../shared/interfaces/Dia';

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
  }

  cambioCurso(){
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
    this.cursoForm.controls['dia'].setValue('')
    this.cursoForm.controls['dia'].enable()
    for(var ratio of this.ratios){
      if(ratio.idRatio == this.cursoForm.controls['ratio'].value){
        this.dias = ratio.dias
      } 
    }
  }
  
  
  
}
