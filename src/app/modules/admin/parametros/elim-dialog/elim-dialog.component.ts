import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZDiaService } from 'src/app/core/http/z_dia/z-dia.service';
import { ZDiaGrupoService } from 'src/app/core/http/z_dia_grupo/z-dia-grupo.service';
import { ZNivelService } from 'src/app/core/http/z_nivel/z-nivel.service';
import { ZRolService } from 'src/app/core/http/z_rol/z-rol.service';
import { ZTipoUsuarioService } from 'src/app/core/http/z_tipoUsuario/z-tipo-usuario.service';
import { ZPeriodoService } from '../../../../core/http/z_periodo/z-periodo.service';

@Component({
  selector: 'app-elim-dialog',
  templateUrl: './elim-dialog.component.html',
  styleUrls: ['./elim-dialog.component.css']
})
export class ElimDialogComponent {
  origen!:string;
  id!:number;

  idCursoPeriodo!:number
  idUsuario!:number

  constructor(
    public dialogRef: MatDialogRef<ElimDialogComponent>,
    private cursoService: ZCursoService,
    private rolService: ZRolService,
    private diaGrupoService: ZDiaGrupoService,
    private diaService: ZDiaService,
    private nivelService: ZNivelService,
    private tipoUsuarioService: ZTipoUsuarioService,
    private periodoService: ZPeriodoService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:any){

    this.id = data.objeto.id
    this.origen = data.origen

    this.idCursoPeriodo = data.objeto.idCursoPeriodo
    this.idUsuario = data.objeto.idUsuario

  }

  enCancelar(): void{
    this.dialogRef.close('se cerro');
  }

  handleRespOk(res: any){
    
  }

  handleError(error:any){

    let mensaje = ""
    let codigo

    if(error.error.code == "23503"){
      
      mensaje = "No se puede eliminar porque ya esta siendo usado el registro"
      codigo = error.error.code
      
    }else{
      codigo = error.error.code
      mensaje = "Ocurrio un problema al realizar la operación"

    }

    this._snackBar.open(mensaje, codigo|| "OK" ,{
      horizontalPosition: "center",
      verticalPosition: "bottom",
      duration: 6*1000,
    });
    
  }

  enConfirmar(): void{


    switch (this.origen) {
      case "cursos":

      this.cursoService.deleteCursoParam(this.id).subscribe(  {
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;
      
      case "dia":

      this.diaService.deleteDiaParam(this.id).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;

      case "nivel":

      this.nivelService.deleteNivelParam(this.id).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;

      case "tipoUsuario":

      this.tipoUsuarioService.deleteTipoUsuarioParam(this.id).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;
    
      case "rol":

      this.rolService.deleteRolParam(this.id).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;
    
      case "diaGrupo":

      this.diaGrupoService.deleteDiaGrupoParam(this.id).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;

      case "periodo":
      
      this.periodoService.deletePeriodoParam(this.id).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;

      case "matriculaExtemporanea":

      this.cursoService.inactiveMatriculaExtemporanea(this.idCursoPeriodo,this.idUsuario).subscribe({
        next: res => this.handleRespOk(res),
        error: error => this.handleError(error),
        complete: () => this.dialogRef.close(true)
      })
        
        break;


      default:
        break;
    }

  }

}
