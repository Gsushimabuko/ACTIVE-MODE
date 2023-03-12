import { Component, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ParaDialogComponent } from '../para-dialog/para-dialog.component';
import { ElimDialogComponent } from '../elim-dialog/elim-dialog.component';

@Component({
  selector: 'app-cursos-param',
  templateUrl: './cursos-param.component.html',
  styleUrls: ['./cursos-param.component.css']
})
export class CursosParamComponent{
  formCursos: FormGroup;

  displayedColumns: string[] = ['nombre','estado','info'];
  dataSource:any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  


    constructor(private formBuilder: FormBuilder,
    public cursoService: ZCursoService,
    public dialog: MatDialog,
    ){


     this.actualizarTabla() 

      

      this.formCursos = this.formBuilder.group({
        propiedades:this.formBuilder.array([])
      })

  
    }

    openDialog(curso:any): void {

      var dialogRef = this.dialog.open(ParaDialogComponent, {
        width: '400px',
    
        hasBackdrop:true,
        data: {
          objeto: curso,
          origen: "cursos",
          listaCampos: ["nombre"]
        }

      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.actualizarTabla()
      });

    }

    get propiedades() : FormArray {
    return this.formCursos.get("propiedades") as FormArray
    }
  
  
    nuevaPropiedad(nombre:string): FormGroup {
      return this.formBuilder.group({
        nombre: [nombre, [Validators.required]]
      })
    }
    
    agregarPropiedad() {
     this.propiedades.push(this.nuevaPropiedad(""));
    }
  
    eliminarPropiedad(id:number) {
      this.propiedades.removeAt(id)
    }

    actualizarTabla(){

      this.cursoService.getCursosParam().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{
      
      for(var curso of this.formCursos.value.propiedades){

        this.cursoService.createCursoParam(curso.nombre).subscribe(res=>{
    
          this.eliminarPropiedad(0)
          this.actualizarTabla()
        })
        
      }  
      
    }

    cambiarEstado(idCurso:number){
      this.cursoService.changeStateCursoParam(idCurso).subscribe(res=>{
        this.actualizarTabla()
        
      })

    }

    eliminarRegistro(id:number){
      
      let objeto = {
        id: id
      }

      var dialogRef = this.dialog.open(ElimDialogComponent, {
        width: '400px',
    
        hasBackdrop:true,
        data: {
          objeto: objeto,
          origen: "cursos",
        }
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.actualizarTabla()
      });

    }

}
