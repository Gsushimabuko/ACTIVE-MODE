import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZPeriodoService } from 'src/app/core/http/z_periodo/z-periodo.service';

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
    private _cursoService: ZCursoService) {
    this.loading = true;

    this.getTiempos();
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
      this.periodoId = data;
    });
  }
}
