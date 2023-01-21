import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)] ]
  })
  hide = true;
  mensaje: string = ""
  constructor(
    private router: Router ,private fb: FormBuilder, /* private padreService: UsuarioPadreService */) { }

  login(){

    const usuario = { 
      correo: this.loginForm.value.email.toLowerCase(),
      contrasena: this.loginForm.value.contrasena,
    }
    /* 
    this.padreService.login(usuario).subscribe((res =>{
      //si respuesta es igual a true
      if (res == true) {
        this.router.navigateByUrl('/padre/cuenta')
      } else {
        this.mensaje = "Usuario o contraseña invalidos"
      }
    })); */
  }

}
