import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { XPuertaService } from 'src/app/core/http/x_puerta/x-puerta.service';



@Component({
  selector: 'app-puerta',
  templateUrl: './puerta.component.html',
  styleUrls: ['./puerta.component.css']
})
export class PuertaComponent implements OnInit {

  puertas = [ "1", "2" , "3", "4", "5" ]
  puerta!: number;
  estado!: number;
  loader = false

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.minLength(5)]],
    nombre: ['', [Validators.required ]],
  })

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar ,private puertaService: XPuertaService) { }

  ngOnInit(): void {
    this.leer()
  }

  marcarAsistenciaExterno(){

    this.loader = true
    if(!this.estado || !this.puerta){
      this.loader = false
      this.openSnackBarERROR("SELECCIONE LA PUERTA Y LA ENTRADA/SALIDA", 3)
      return
    }

    const body = {
      dni: this.loginForm.value.correo,
      puerta: this.puerta,
      tipoRegistro: this.estado
    }

    this.puertaService.checkAsistencia(body).subscribe((res => {
      this.loader = false
      console.log(res)
      const mensaje = res.registros.nombrePersona + " " + "BIENVENIDO"
      this.openSnackBarOK(mensaje, 3)
    }
    ),(err: HttpErrorResponse) =>{
      this.loader = false
      if(err.status == 500){
        this.openSnackBarERROR("Error, vuelva intentarlo más tarde",  3)
      }else if (err.status == 404){
        this.openSnackBarFAIL("¡ACCESO RESTRINGIDO!",  3)
      }
    })




  }

  leer = () => {
            
    let barcode = ""
    let interval:any

    document.addEventListener("keydown", (evt) => {
        if(interval)
            clearInterval(interval)
        
        if(evt.code == "Enter" || evt.key == 'Alt'){
            if(barcode)
                console.log("SE APRETÓ ENTER")
                this.marcarAsistencia(barcode.toString())
                barcode =''
            return

        }
        if (evt.key != "Shift")
        
            barcode += evt.key
        interval = setInterval( () => barcode ="",20)
    })

  }

  marcarAsistencia(codigo:string){
    this.loader = true
    if(!this.estado || !this.puerta){
      this.loader = false
      this.openSnackBarERROR("SELECCIONE LA PUERTA Y LA ENTRADA/SALIDA", 3)
      return
    }

    const body = {
      dni : codigo,
      puerta: this.puerta,
      tipoRegistro: this.estado
    }

    this.puertaService.checkAsistencia(body).subscribe((res => {
      this.loader = false
      console.log(res)
      const mensaje = res.registros.nombrePersona + " " + "BIENVENIDO"
      this.openSnackBarOK(mensaje, 3)
    }
    ),(err: HttpErrorResponse) =>{
      this.loader = false
      if(err.status == 500){
        this.openSnackBarERROR("Error, vuelva intentarlo más tarde",  3)
      }
      else if (err.status == 403){
        this.openSnackBarERROR("Datos incompletos",  3)
      }
      else if (err.status == 404){
        this.openSnackBarFAIL("¡ACCESO RESTRINGIDO!",  3)
      }
    })
  }

  
  openSnackBarOK(message: string, seconds: number) {
  
    this.snackbar.open(message, 'OK', {
      duration: seconds * 1000,
      panelClass: ['snackbar-success'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    }, );
  }
  openSnackBarFAIL(message: string, seconds: number) {
  
    this.snackbar.open(message, 'OK', {
      duration: seconds * 1000,
      panelClass: ['snackbar-fail'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    }, );
  }
  openSnackBarERROR(message: string, seconds: number) {
  
    this.snackbar.open(message, 'OK', {
      duration: seconds * 1000,
      panelClass: ['snackbar-error'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    }, );
  }


}
