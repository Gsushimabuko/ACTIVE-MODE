import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZCursoService } from '../../../../../core/http/z_curso/z-curso.service';

@Component({
  selector: 'app-cursos-dialog',
  templateUrl: './cursos-dialog.component.html',
  styleUrls: ['./cursos-dialog.component.css']
})
export class CursosDialogComponent {
  contenidoForm: FormGroup;
  idCurso!:number

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CursosDialogComponent>,
    private cursoService: ZCursoService,
    @Inject(MAT_DIALOG_DATA) public data:any){

    console.log(data)

    this.idCurso = data.curso.id
    
    this.contenidoForm = this.formBuilder.group({
      nombre: [data.curso.nombre, [Validators.required]]
    }) 


  }

  enCancelar(): void{
    this.dialogRef.close('se cerro');
  }

  enConfirmar(): void{

    this.cursoService.updateCursoParam(this.contenidoForm.value.nombre,this.idCurso).subscribe(res =>{
          this.dialogRef.close(res);
    })

      
  }



}
