import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';

@Component({
  selector: 'app-frecuencias',
  templateUrl: './frecuencias.component.html',
  styleUrls: ['./frecuencias.component.css']
})
export class FrecuenciasComponent {

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

      this.cursoService.getCursosAll().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{
      
      for(var curso of this.formCursos.value.propiedades){

        this.cursoService.createCurso(curso.nombre).subscribe(res=>{
          console.log(res)
          this.eliminarPropiedad(0)
          this.actualizarTabla()
        })
        
      }  
      
    }

    cambiarEstado(idCurso:number){
      this.cursoService.ChangeStateCurso(idCurso).subscribe(res=>{
        this.actualizarTabla()
        
      })

    }

}
