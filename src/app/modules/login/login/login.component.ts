import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(5)] ],
   
    
  })
  hide = true;
  mensaje: string = ""
  constructor(
    private router: Router ,private fb: FormBuilder,  private usuarioService: ZUsuarioService, private snackbar:MatSnackBar) { }

  login(){

    const usuario = { 
      correo: this.loginForm.value.correo.toLowerCase(),
      contrasena: this.loginForm.value.contrasena,
    }
    
    this.usuarioService.login(usuario).subscribe(res=>{
     console.log("RES: ", res)
      //si respuesta es igual a true
      if (res == true) {
        console.log("wiii")
        this.router.navigateByUrl('/matricula/dashboard')
      } else{
        this.mensaje = "Datos incorrectos"
      }
    }, (err:HttpErrorResponse) => { 

      if (err.status == 500){
        this.mensaje = "Error de servidor, intente más tarde"
       }  else{
         this.mensaje = "Error desconocido"

       }
        
    })}; 
  
  
  openSnackBar(message: string, seconds: number) {
    this.snackbar.open(message, 'X', {
      duration: seconds * 1000,
    });
  }

}
