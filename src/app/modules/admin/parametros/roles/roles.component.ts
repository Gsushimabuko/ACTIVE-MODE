import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZRolService } from 'src/app/core/http/z_rol/z-rol.service';
import { ParaDialogComponent } from '../para-dialog/para-dialog.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {

  formObjetos: FormGroup;

  displayedColumns: string[] = ['nombre','estado','info'];
  dataSource:any = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  


    constructor(private formBuilder: FormBuilder,
    public objetoService: ZRolService,
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
          origen: "rol",
          listaCampos: ["nombre"]
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
        nombre: ["", [Validators.required]]
      })
    }
    
    agregarPropiedad() {
     this.propiedades.push(this.nuevaPropiedad());
    }
  
    eliminarPropiedad(id:number) {
      this.propiedades.removeAt(id)
    }

    actualizarTabla(){

      this.objetoService.getRolesParam().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{
      
      for(var objeto of this.formObjetos.value.propiedades){

        this.objetoService.createRolParam(objeto.nombre).subscribe(res=>{
          console.log(res)
          this.eliminarPropiedad(0)
          this.actualizarTabla()
        })
        
      }  
      
    }

    cambiarEstado(id:number){
      this.objetoService.changeStateRolParam(id).subscribe(res=>{
        this.actualizarTabla()
        
      })

    }

    eliminarRegistro(id:number){
      this.objetoService.deleteRolParam(id).subscribe(res=>{
        this.actualizarTabla()
        
      })
    }

}
