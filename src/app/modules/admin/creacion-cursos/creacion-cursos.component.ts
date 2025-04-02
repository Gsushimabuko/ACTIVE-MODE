import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZPeriodoService } from 'src/app/core/http/z_periodo/z-periodo.service';
import { EditarCursoPeriodoComponent } from '../editar-curso-periodo/editar-curso-periodo.component';
import { ElimDialogComponent } from '../parametros/elim-dialog/elim-dialog.component';
import { ParaDialogComponent } from '../parametros/para-dialog/para-dialog.component';

@Component({
  selector: 'app-creacion-cursos',
  templateUrl: './creacion-cursos.component.html',
  styleUrls: ['./creacion-cursos.component.css']
})
export class CreacionCursosComponent {
  displayedColumns: string[] = ['curso', 'estado', 'profesor', 'cupos', 'info'];
  dataSource: any = new MatTableDataSource<any>();

  anos: any[] = [];
  meses: any[] = [];

  periodoId: number = 1;

  anoElegido: number = 2023;
  mesElegido: number = 1;

  loading: boolean = true;

  constructor(private _periodoService: ZPeriodoService,
    private _cursoService: ZCursoService,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,) {
    this.loading = true;

    this._route.queryParams.subscribe(params => {
      if (params['ano'] && params['mes']) {
        this.anoElegido = parseInt(params['ano']);
        this.mesElegido = parseInt(params['mes']);
      }
    });

    this.getTiempos();
    this.getCursosPeriodos();
  }

  getTiempos() {
    this._periodoService.getPeriodoTiempos().subscribe(data => {
      console.log(data);
      
      this.anos = data.anos;
      this.meses = data.meses;

      this.loading = false;
    });
  }

  getCursosPeriodos() {
    if (this.anoElegido == 0) return;
    if (this.mesElegido == 0) return;

    this.loading = true;
    
    //Get cursosperiodos
    this._cursoService.getCursoPeriodo(this.mesElegido, this.anoElegido).subscribe(data => {
      console.log(data);
      this.dataSource = data.cursosPeriodos;

      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  getPeriodo() {
    this._periodoService.getPeriodo(this.mesElegido, this.anoElegido).subscribe(data => {
      console.log(data);
      this.periodoId = data.id;
    });
  }

  redirectToCursoNuevo() {
    this._periodoService.getPeriodo(this.mesElegido, this.anoElegido).subscribe(data => {
      //console.log(data);
      this.periodoId = data.id;
      this._router.navigate(['admin/creacion-form/' + this.periodoId]);
    });
  }

  duplicarPeriodoAnterior() {
    this.loading = true;

    let mesAnt = -1;
    let anoAnt = -1;

    if (this.mesElegido == 1) {
      mesAnt = 12;
      anoAnt = this.anoElegido - 1;
    }
    else {
      mesAnt = this.mesElegido - 1;
      anoAnt = this.anoElegido;
    }

    this._periodoService.getPeriodo(mesAnt, anoAnt).subscribe(periodoAnt => {
      if (!periodoAnt) return;
      
      this._periodoService.getPeriodo(this.mesElegido, this.anoElegido).subscribe(periodo => {
        this._cursoService.duplicateCursoPeriodo(periodo, periodoAnt).subscribe(data => {
          console.log(data);
          this.loading = false;
          this.getCursosPeriodos();
        }, error => {
          this.loading = false;
        });

      }, error => {
        this.loading = false;
      });
    }, error => {
      console.log(error);
      this.loading = false;
    })
  }

  openDialog(curso: any): void {

    let dialogRef = this.dialog.open(ParaDialogComponent, {
      width: '400px',
  
      hasBackdrop: true,
      data: {
        objeto: curso,
        origen: "curso-periodo",
        listaCampos: ['profesor', 'cupo_max']
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      this.loading = true;
      console.log('The dialog was closed');
      this.getCursosPeriodos();
    });

  }

  cambiarEstado(id: number) {
    this.loading = true;

    this._cursoService.changeStateCursoPeriodo(id).subscribe(data => {
      this.getCursosPeriodos();
    });

  }

  eliminarRegistro(id: number){
    
    let objeto = {
      id: id
    }

    var dialogRef = this.dialog.open(ElimDialogComponent, {
      width: '400px',
  
      hasBackdrop: true,
      data: {
        objeto: objeto,
        origen: "curso-periodo",
      }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loading = true;
      console.log('The dialog was closed');
      this.getCursosPeriodos();
    });

  }
}
