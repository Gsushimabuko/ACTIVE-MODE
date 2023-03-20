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
  displayedColumns: string[] = ['nombre', 'apellidop', 'apellidom', 'dni', 'accion'];
  dataSource:any = new MatTableDataSource<any>();


  noResults = true

  //tabla
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

  

 constructor(private usuarioService : ZUsuarioService,
  public dialog: MatDialog,
  private fb: FormBuilder){

    this.filterForm = this.fb.group({

      nombre: [''],
      dni: [''],
      apellidop: [''],
      apellidom:['']
    })

    this.buscarAlumnos()
 }

  ngOnInit(): void {

    
  }



  buscarAlumnos(){

    const nombre = this.filterForm.controls['nombre'].value.trim()
    const apellidop = this.filterForm.controls['apellidop'].value.trim()
    const apellidom = this.filterForm.controls['apellidom'].value.trim()
    const dni = this.filterForm.controls['dni'].value.trim()

    this.usuarioService.getUsuariosFiltros(nombre,apellidop,apellidom,dni).subscribe({
      next: res => {
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort  
      },
      error: error => console.log(error),
      complete: () => {
        if(this.dataSource.data[0] == undefined){
          this.noResults = false
        }else{
          this.noResults = true
        }
      },
    }
)
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
