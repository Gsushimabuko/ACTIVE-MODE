import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZDiaService } from 'src/app/core/http/z_dia/z-dia.service';
import { ParaDialogComponent } from '../para-dialog/para-dialog.component';

@Component({
  selector: 'app-dia',
  templateUrl: './dia.component.html',
  styleUrls: ['./dia.component.css']
})
export class DiaComponent {
  formObjetos: FormGroup;

  displayedColumns: string[] = ['dias_semana','dias_tarifa','estado','info'];
  dataSource:any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  


    constructor(private formBuilder: FormBuilder,
    public objetoService: ZDiaService,
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
          origen: "dia",
          listaCampos: ["dias_semana"]
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
        dias_semana: ["", [Validators.required]],
        dias_tarifa: ["", [Validators.required]]
      })
    }
    
    agregarPropiedad() {
     this.propiedades.push(this.nuevaPropiedad());
    }
  
    eliminarPropiedad(id:number) {
      this.propiedades.removeAt(id)
    }

    actualizarTabla(){

      this.objetoService.getDiasParam().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{
      
      for(var objeto of this.formObjetos.value.propiedades){

        this.objetoService.createDiaParam(objeto.dias_semana,parseInt(objeto.dias_tarifa)).subscribe(res=>{
          console.log(res)
          this.eliminarPropiedad(0)
          this.actualizarTabla()
        })
        
      }  
      
    }

    cambiarEstado(id:number){
      this.objetoService.changeStateDiaParam(id).subscribe(res=>{
        this.actualizarTabla()
        
      })

    }

    eliminarRegistro(id:number){
      this.objetoService.deleteDiaParam(id).subscribe(res=>{
        this.actualizarTabla()
        
      })
    }
}
