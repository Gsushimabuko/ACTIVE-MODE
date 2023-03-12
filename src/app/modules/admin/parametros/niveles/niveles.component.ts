import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZNivelService } from 'src/app/core/http/z_nivel/z-nivel.service';
import { ElimDialogComponent } from '../elim-dialog/elim-dialog.component';
import { ParaDialogComponent } from '../para-dialog/para-dialog.component';

@Component({
  selector: 'app-niveles',
  templateUrl: './niveles.component.html',
  styleUrls: ['./niveles.component.css']
})
export class NivelesComponent {

  formObjetos: FormGroup;

  displayedColumns: string[] = ['nivel','hora','estado','info'];
  dataSource:any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  


    constructor(private formBuilder: FormBuilder,
    public objetoService: ZNivelService,
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
          origen: "nivel",
          listaCampos: ["nivel","hora"]
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
        nivel: ["", [Validators.required]],
        hora: ["", [Validators.required]]
      })
    }
    
    agregarPropiedad() {
     this.propiedades.push(this.nuevaPropiedad());
    }
  
    eliminarPropiedad(id:number) {
      this.propiedades.removeAt(id)
    }

    actualizarTabla(){

      this.objetoService.getNivelesParam().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{
      
      for(var objeto of this.formObjetos.value.propiedades){

        this.objetoService.createNivelParam(objeto.nivel,objeto.hora).subscribe(res=>{
      
          this.eliminarPropiedad(0)
          this.actualizarTabla()
        })
        
      }  
      
    }

    cambiarEstado(id:number){
      this.objetoService.changeStateNivelParam(id).subscribe(res=>{
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
          origen: "nivel",
        }
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.actualizarTabla()
      });

    }

}
