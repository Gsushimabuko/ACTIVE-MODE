import { Component, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursoParam } from '../../../shared/interfaces/Curso';
import { ZCursoService } from '../../../../core/http/z_curso/z-curso.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-cursos-param',
  templateUrl: './cursos-param.component.html',
  styleUrls: ['./cursos-param.component.css']
})
export class CursosParamComponent{
  formCursos: FormGroup;

  displayedColumns: string[] = ['nombre','estado','id','info'];
  dataSource:any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  


    constructor(private formBuilder: FormBuilder,
    public cursoService: ZCursoService
    ){


     this.actualizarTabla() 

      

      this.formCursos = this.formBuilder.group({
        propiedades:this.formBuilder.array([])
      })

  
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
          console.log(res)
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

}
