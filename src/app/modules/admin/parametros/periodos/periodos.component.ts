import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZPeriodoService } from 'src/app/core/http/z_periodo/z-periodo.service';
import { ElimDialogComponent } from '../elim-dialog/elim-dialog.component';
import { ParaDialogComponent } from '../para-dialog/para-dialog.component';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})
export class PeriodosComponent {
  formObjetos: FormGroup;

  displayedColumns: string[] = ['periodo_fecha','estado','info'];
  dataSource:any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;

    constructor(private formBuilder: FormBuilder,
    public objetoService: ZPeriodoService,
    public dialog: MatDialog,
    ){

     this.actualizarTabla() 

      this.formObjetos = this.formBuilder.group({
        propiedades:this.formBuilder.array([])
      })

  
    }

    openDialog(objeto:any): void {

      var dialogRef = this.dialog.open(ParaDialogComponent, {
        width: '400px',
    
        hasBackdrop:true,
        data: {
          objeto: objeto,
          origen: "periodo",
          listaCampos: []
        }
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.actualizarTabla()
      });

    }

    get propiedades() : FormArray {
    return this.formObjetos.get("propiedades") as FormArray
    }
  
  
    nuevaPropiedad(): FormGroup {
      return this.formBuilder.group({
        mes: ["", [Validators.required]],
        ano: ["", [Validators.required]]
      })
    }
    
    agregarPropiedad() {
     this.propiedades.push(this.nuevaPropiedad());
    }
  
    eliminarPropiedad(id:number) {
      this.propiedades.removeAt(id)
    }

    actualizarTabla(){

      this.objetoService.getPeriodosParam().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{
      
      for(var objeto of this.formObjetos.value.propiedades){

        this.objetoService.createPeriodoParam(parseInt(objeto.mes),parseInt(objeto.ano)).subscribe(res=>{
          this.eliminarPropiedad(0)
          this.actualizarTabla()
        })
        
      }  
      
    }

    cambiarEstado(id:number){
      this.objetoService.changeStatePeriodoParam(id).subscribe(res=>{
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
          origen: "periodo",
        }
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.actualizarTabla()
      });
    }
}
