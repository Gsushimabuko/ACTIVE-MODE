import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ZMatriculaService } from '../../../core/http/z_matricula/z-matricula.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.css']
})
export class ReporteGeneralComponent {
  constructor(private http: HttpClient, private matriculaService: ZMatriculaService) {
    this.downloadFile()
  }
  
  downloadFile() {
    this.matriculaService.getGeneralMatriculaExcel().subscribe((res:any)=>{
      let blob:any = new Blob([res], { type: 'text/json; charset=utf-8application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'PagosMatriculas.xlsx');
    }),(error: any) => {
      
      console.log(error)}
}
}
