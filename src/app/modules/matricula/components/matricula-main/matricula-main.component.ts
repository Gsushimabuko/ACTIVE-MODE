import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';

@Component({
  selector: 'app-matricula-main',
  templateUrl: './matricula-main.component.html',
  styleUrls: ['./matricula-main.component.css']
})
export class MatriculaMainComponent {

  idUsuario!:number
  cursoForm!: FormGroup
  horarios:any[] = [
    {nombre:'Solo Lunes',valor:1},
    {nombre:'Solo miércoles',valor:1},
    {nombre:'Solo viernes',valor:1},
    {nombre:'Lunes y Miércoles',valor:2},
    {nombre:'Miércoles y viernes',valor:2},
    {nombre:'Lunes y viernes',valor:2},
    {nommbre:'Lun, miér y vier',valor:3}
]
  idTipoUsuario: number;
  cursosGenerales!: any;
  cursos!:any
  curso!:any
  niveles!:any
  dias!:any


  constructor(private formBuilder: FormBuilder,
    private cursoService:ZCursoService) {

    this.idUsuario=1
    this.idTipoUsuario=2

    this.cursoService.getCursosHorarios(this.idTipoUsuario).subscribe(res=>{
      console.log(res)
      this.cursosGenerales =res
      this.cursos = this.cursosGenerales.cursos
    })


    this.cursoForm = this.formBuilder.group({
      curso: ['', [Validators.required]],
      dias: [{ value: '', disabled: true }, [Validators.required]],
      nivel: [{ value: '', disabled: true }, [Validators.required]],
    })

  }

  cambioCurso(idCurso:number){
    this.cursoForm.controls['dias'].enable()
    this.cursoForm.controls['dias'].setValue('')
    this.cursoForm.controls['nivel'].setValue('')
    this.cursoForm.controls['nivel'].disable()

    for(var curso of this.cursosGenerales.dias){

      if(curso.idCurso == idCurso){
        this.dias = curso.dias
      }
      
    }

  }

  cambioDia(){

    this.cursoForm.controls['nivel'].setValue('')
    this.cursoForm.controls['nivel'].enable()

    for(var curso of this.cursosGenerales.horarios){

      if(curso.idCurso == this.cursoForm.controls['curso'].value){
        console.log(curso.horarios)
        this.niveles = curso.horarios
      }
      
    }
    
  }
  
  
  
}
