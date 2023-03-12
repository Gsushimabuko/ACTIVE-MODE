import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZDiaService } from 'src/app/core/http/z_dia/z-dia.service';
import { ZDiaGrupoService } from 'src/app/core/http/z_dia_grupo/z-dia-grupo.service';
import { ElimDialogComponent } from '../elim-dialog/elim-dialog.component';
import { ParaDialogComponent } from '../para-dialog/para-dialog.component';


@Component({
  selector: 'app-dia-grupo',
  templateUrl: './dia-grupo.component.html',
  styleUrls: ['./dia-grupo.component.css']
})
export class DiaGrupoComponent {
  formObjetos: FormGroup;


  displayedColumns: string[] = ['nombre','id_dia','estado','info'];
  dataSource:any = new MatTableDataSource<any>();
  dias:any
  listaClase:any = []
  listaDiasGenerador:string = ""
  generadorFlag:boolean= false

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  


    constructor(private formBuilder: FormBuilder,
    private objetoService: ZDiaGrupoService,
    private diaService: ZDiaService,
    public dialog: MatDialog,
    ){

      
     this.actualizarTabla() 

      this.formObjetos = this.formBuilder.group({
        propiedades:this.formBuilder.array([])
      })


      this.diaService.getDiasParam().subscribe(res=>{
        this.dias = res
      })

  
    }

    openDialog(objeto:any): void {

      var dialogRef = this.dialog.open(ParaDialogComponent, {
        width: '400px',
    
        hasBackdrop:true,
        data: {
          objeto: objeto,
          origen: "diaGrupo",
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
  
  
    nuevaPropiedad(nombre:string,id_dia:number|null): FormGroup {
      return this.formBuilder.group({
        nombre: [nombre, [Validators.required]],
        id_dia: [id_dia, [Validators.required]],
      })
    }
    
    agregarPropiedad(nombre:string,id_dia:number|null) {
     this.propiedades.push(this.nuevaPropiedad(nombre,id_dia));
     this.listaClase.push("")
    }

    controlPropiedad(index:number) : any{
      return this.propiedades.at(index)
    }
  
    eliminarPropiedad(id:number) {
      this.listaClase.splice(id,1)
      this.propiedades.removeAt(id)
    }

    actualizarTabla(){

      this.objetoService.getDiasGrupoParam().subscribe(res =>{
        this.dataSource.data = res
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

    }

    save(): void{

      let index = 0
      
      for(var objeto of this.formObjetos.value.propiedades){

        let serieValor = this.listaClase[index].split('').join(',')
        
        this.objetoService.createDiaGrupoParam(objeto.nombre,serieValor,parseInt(objeto.id_dia)).subscribe(res=>{
          this.eliminarPropiedad(0)
          this.actualizarTabla()
          this.listaDiasGenerador = ""
          this.generadorFlag= false
        })
        
      }  
      
    }

    cambiarEstado(id:number){
      this.objetoService.changeStateDiaGrupoParam(id).subscribe(res=>{
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
          origen: "diaGrupo",
        }
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.actualizarTabla()
      });

    }

    hizoClick(button:MatButton ,index:number,num:string){

      const diasLetras = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"]

      let nombreProp = ""
      let idDia = null
     
      let nuevoRegistro = this.listaClase[index]

      if(button.color=="accent"){
        button.color = "primary"
        nuevoRegistro = this.listaClase[index]+ num
      }else if (button.color=="primary") {
        button.color = "accent"
        nuevoRegistro = this.listaClase[index].replace(num,"")
      }
   
      this.listaClase[index] = nuevoRegistro.split('').sort().join('')


      for (var i = 0; i < this.listaClase[index].length; i++) {

        if(i==this.listaClase[index].length-1 && i!=0){
          nombreProp = nombreProp + " y "
        }else if(i!=0){
          nombreProp = nombreProp + ", "
        }

        nombreProp = nombreProp + diasLetras[parseInt(this.listaClase[index][i])]
      }

      for(let dia of this.dias){
        if(dia.dias_semana.includes(this.listaClase[index].length)){
            idDia = dia.id
        }
      }

      this.controlPropiedad(index).controls['nombre'].setValue(nombreProp)
      this.controlPropiedad(index).controls['id_dia'].setValue(idDia)

      console.log(this.listaClase)

    }

    generador(button:MatButton,num:string){
     
      let nuevoRegistro = this.listaDiasGenerador

      if(button.color=="accent"){
        button.color = "primary"
        nuevoRegistro = this.listaDiasGenerador+ num
      }else if (button.color=="primary") {
        button.color = "accent"
        nuevoRegistro = this.listaDiasGenerador.replace(num,"")
      }
   
      this.listaDiasGenerador = nuevoRegistro.split('').sort().join('')

      console.log(this.listaDiasGenerador)

    }

    generarAuto(){

      this.generadorFlag= true

      const diasLetras = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"]


      const combinaciones = this.getCombinations(this.listaDiasGenerador)

      combinaciones.sort(function(a, b) {
        return a.length - b.length
      });


      for(let comb of combinaciones){

        let nombreProp = ""
        let idDia = null

        for (var i = 0; i < comb.length; i++) {

          if(i==comb.length-1 && i!=0){
            nombreProp = nombreProp + " y "
          }else if(i!=0){
            nombreProp = nombreProp + ", "
          }

          nombreProp = nombreProp + diasLetras[parseInt(comb[i])]
        }

        for(let dia of this.dias){
          if(dia.dias_semana.includes(comb.length)){
              idDia = dia.id
          }
        }

        this.agregarPropiedad(nombreProp,idDia)
      }

      this.listaClase = combinaciones

    }


    getCombinations(chars:string) : string[] {

      var result: string[] = [];
      var f = function(prefix:string, chars:string) {
        for (var i = 0; i < chars.length; i++) {
          result.push(prefix + chars[i]);
          f(prefix + chars[i], chars.slice(i + 1));
        }
      }
      f('', chars);
      return result;
    }

    eliminarTodo(){

      for(var objeto of this.formObjetos.value.propiedades){
        this.listaDiasGenerador = ""
        this.generadorFlag= false
        this.eliminarPropiedad(0)
      }
    }
}
