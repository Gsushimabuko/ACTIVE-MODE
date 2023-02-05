import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {


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
        if(this.usuarioService.usuario.id_rol != 2){
          this.mensaje = "Usuario no administrador"
        }else{
          this.router.navigateByUrl('/admin/dashboard')
        }

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
