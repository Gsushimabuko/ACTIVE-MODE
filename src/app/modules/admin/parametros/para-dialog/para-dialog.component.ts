import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZRolService } from 'src/app/core/http/z_rol/z-rol.service';
import { ZDiaService } from '../../../../core/http/z_dia/z-dia.service';
import { ZNivelService } from 'src/app/core/http/z_nivel/z-nivel.service';
import { ZTipoUsuarioService } from '../../../../core/http/z_tipoUsuario/z-tipo-usuario.service';
import { ZDiaGrupoService } from '../../../../core/http/z_dia_grupo/z-dia-grupo.service';

@Component({
  selector: 'app-para-dialog',
  templateUrl: './para-dialog.component.html',
  styleUrls: ['./para-dialog.component.css']
})
export class ParaDialogComponent {
  contenidoForm: FormGroup;
  origen!:string;
  id!:number;
  campos!:any;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ParaDialogComponent>,
    private cursoService: ZCursoService,
    private rolService: ZRolService,
    private diaGrupoService: ZDiaGrupoService,
    private diaService: ZDiaService,
    private nivelService: ZNivelService,
    private tipoUsuarioService: ZTipoUsuarioService,
    @Inject(MAT_DIALOG_DATA) public data:any){

    console.log(data)

    this.id = data.objeto.id
    this.origen = data.origen
    this.campos = data.listaCampos

    const camposForm = {} as { [key: string]: any}

    for (let campo of this.campos) {
        camposForm[campo] = new FormControl(data.objeto[campo]);
    }

    this.contenidoForm = this.formBuilder.group(camposForm) 

    console.log(this.contenidoForm.value)
  }

  enCancelar(): void{
    this.dialogRef.close('se cerro');
  }

  enConfirmar(): void{


    switch (this.origen) {
      case "cursos":

      this.cursoService.updateCursoParam(this.contenidoForm.value,this.id).subscribe(res =>{
        this.dialogRef.close(res);
      })
        
        break;
      
      case "dia":

      this.diaService.updateDiaParam(this.contenidoForm.value,this.id).subscribe(res =>{
        this.dialogRef.close(res);
      })
        
        break;

      case "niveles":

      this.nivelService.updateNivelParam(this.contenidoForm.value,this.id).subscribe(res =>{
        this.dialogRef.close(res);
      })
        
        break;

      case "tipoUsuarios":

      this.tipoUsuarioService.updateTipoUsuarioParam(this.contenidoForm.value,this.id).subscribe(res =>{
        this.dialogRef.close(res);
      })
        
        break;
    
      case "roles":

      this.rolService.updateRolParam(this.contenidoForm.value,this.id).subscribe(res =>{
        this.dialogRef.close(res);
      })
        
        break;
    
      case "diaGrupo":

      this.diaGrupoService.updateDiaGrupoParam(this.contenidoForm.value,this.id).subscribe(res =>{
        this.dialogRef.close(res);
      })
        
        break;

      default:
        break;
    }

  

      
  }

}
