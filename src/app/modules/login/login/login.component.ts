import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModoAccesoService } from 'src/app/core/acceso/modo-acceso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(5)]],
  })
  hide = true;
  mensaje: string = ""
  enviando = false

  constructor(private router: Router, private fb: FormBuilder, private usuarioService: ZUsuarioService, private modo: ModoAccesoService) { }

  invalido(campo: string): boolean {
    const c = this.loginForm.get(campo)!
    return c.invalid && c.touched
  }

  login() {
    this.mensaje = ""
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    this.enviando = true

    const usuario = {
      correo: this.loginForm.value.correo.toLowerCase(),
      contrasena: this.loginForm.value.contrasena,
    }

    this.usuarioService.login(usuario).subscribe(res => {
      this.enviando = false
      if (res == true) {
        this.modo.salirDeInvitado()
        this.router.navigateByUrl('/matricula/dashboard')
      } else {
        this.mensaje = "El correo o la contraseña no son correctos."
      }
    }, (err: HttpErrorResponse) => {
      this.enviando = false
      this.mensaje = err.status == 500 ? "Error de servidor, intenta más tarde." : "No pudimos iniciar sesión. Inténtalo de nuevo."
    })
  }
}
