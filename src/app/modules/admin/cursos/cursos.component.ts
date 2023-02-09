import { Component, OnInit, ViewChild } from '@angular/core';
import { ZUsuarioService } from '../../../core/http/z_usuario/z-usuario.service';
import { ZCursoService } from '../../../core/http/z_curso/z-curso.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  //variables
  cursos! :any[] 
  cursosPeriodo! :any[]
  horarios! :any[]
  horarioElegidoId!: any
  listaAlumnos! :any[]
  searchFilters = false

  noResults = true

  //tabla
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombre', 'apellidop', 'telefono', 'tipo_usuario', 'fecha_matricula'];
  dataSource:any = new MatTableDataSource<any>();


 constructor(private cursosService : ZCursoService){

 }

  ngOnInit(): void {
    this.buscarCurso()  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buscarCurso(){
    this.searchFilters = false
    this.cursosService.getOnlyCursos().subscribe((res => {
      this.cursos = res.cursosActivos
    }))
  }
  buscarCursoPeriodo(evt:any){
    this.searchFilters = false
     this.cursosService.getOnlyCursoPeriodo(evt).subscribe((res => {
      this.cursosPeriodo = res.cursosActivos
      console.log(this.cursosPeriodo)
    })) 
  }
  buscarHorario(evt:any){
    this.searchFilters = false
    this.cursosService.getOnlyHorario(evt).subscribe((res =>{
      this.horarios = res.horarios
      this.searchFilters = true
    }))
  }
  guardarIdHorario(evt:any){
    this.horarioElegidoId = evt
  }
  buscarAlumnos(){
    this.cursosService.getOnlyAlumnosHorario(this.horarioElegidoId).subscribe((res) => {
      this.dataSource.data = res.horarioMatricula
      if(this.dataSource.data[0] == undefined){
        this.noResults = false
      }else{
        this.noResults = true
      }
    })
  }

}


