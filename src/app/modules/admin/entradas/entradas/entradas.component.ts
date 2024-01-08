import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as saveAs from 'file-saver';
import { XPuertaService } from 'src/app/core/http/x_puerta/x-puerta.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent {
  listaFechasAno! : string[]
  displayedColumns: string[] = ['fecha', 'puerta', 'tipoRegistro', 'codigoLeido','nombrePersona', 'tipoPersona', 'nombreHijo'];
  dataSource:any = new MatTableDataSource<any>();
  loader = false
  message= ""

  fechas: FormGroup = this.fb.group({
    inicio: ['', [Validators.required]],
    fin: ['', [Validators.required ]],
  })

  //tabla
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

 constructor(
  private xPuertaService: XPuertaService,
  private fb: FormBuilder){
 }

  ngOnInit(): void {    
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-04-01');
    const dateArray = [];

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const formattedDate = currentDate.toISOString().slice(0, 10);
      dateArray.push(formattedDate);
    }
    this.listaFechasAno = dateArray
  }

  downloadFile(){

    const body =  {
      inicio:  this.fechas.value.inicio,
      fin: this.fechas.value.fin,
    }
   
    console.log(body)
    if(!body.inicio || !body.fin){
      return
    }

    this.loader = true
    
    this.xPuertaService.getRegistrosIndexReporte(body).subscribe((res:any)=>{
        this.loader = false
        let blob:any = new Blob([res], { type: 'text/json; charset=utf-8application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'ReporteExcel.xlsx');
      }),(error: any) => {
        this.loader = false
        console.log(error)}
  }

  buscarRegistros(){

    const body =  {
      inicio:  this.fechas.value.inicio,
      fin: this.fechas.value.fin,
    }
   
    console.log(body)
    if(!body.inicio || !body.fin){
      return
    }

    this.loader = true

    this.xPuertaService.getRegistrosIndex(body.inicio, body.fin).subscribe((res) => {
      this.message= ""
      this.loader = false
      this.dataSource.data = res.registros
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort  
        if(this.dataSource.data[0] == undefined){
          this.message= "NO HAY RESULTADOS"
         
        }},
      (err: HttpErrorResponse) =>{
        this.loader = false
        if(err.status == 403){
          this.message= "ENVÍO INCOMPLETO"
        }
        if(err.status == 500){
          this.message= "ERROR DE SERVIDOR"
        }
      })

  }
  
}

