import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from '../../../core/http/z_usuario/z-usuario.service';
import { DialogMatriculaComponent } from '../dialog-matricula/dialog-matricula.component';

@Component({
  selector: 'app-matricula-extemporanea',
  templateUrl: './matricula-extemporanea.component.html',
  styleUrls: ['./matricula-extemporanea.component.css']
})
export class MatriculaExtemporaneaComponent {

  cursos! :any[] 
  cursosPeriodo! :any[]
  horarios! :any[]
  horarioElegidoId!: any
  listaAlumnos! :any[]
  filterForm!: FormGroup

  noResults = true

  //tabla
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombre', 'apellidop', 'apellidom', 'dni', 'accion'];
  dataSource:any = new MatTableDataSource<any>();


 constructor(private usuarioService : ZUsuarioService,
  public dialog: MatDialog,
  private fb: FormBuilder){

    this.filterForm = this.fb.group({

      nombre: [''],
      dni: [''],
      apellidop: [''],
      apellidom:['']
    })

    const nombre = this.filterForm.controls['nombre'].value
    const apellidop = this.filterForm.controls['apellidop'].value
    const apellidom = this.filterForm.controls['apellidom'].value
    const dni = this.filterForm.controls['dni'].value

    this.usuarioService.getUsuariosFiltros(nombre,apellidop,apellidom,dni).subscribe((res) => {

      this.dataSource.data = res
      if(this.dataSource.data[0] == undefined){
        this.noResults = false
      }else{
        this.noResults = true
      }
    })


 }

  ngOnInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buscarAlumnos(){

    const nombre = this.filterForm.controls['nombre'].value.trim()
    const apellidop = this.filterForm.controls['apellidop'].value.trim()
    const apellidom = this.filterForm.controls['apellidom'].value.trim()
    const dni = this.filterForm.controls['dni'].value.trim()

    this.usuarioService.getUsuariosFiltros(nombre,apellidop,apellidom,dni).subscribe((res) => {

      this.dataSource.data = res
      if(this.dataSource.data[0] == undefined){
        this.noResults = false
      }else{
        this.noResults = true
      }
    })
  }

  openDialogMatricula(usuario:any){

    var dialogRef = this.dialog.open(DialogMatriculaComponent, {
      width: '800px',
  
      hasBackdrop:true,
      data: {
        idUsuario: usuario.id,
        idTipoUsuario:  usuario.id_tipo_usuario
      }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

}
