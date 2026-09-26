import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
    contrasena: ['', [Validators.required, Validators.minLength(5)]],
  })
  hide = true;
  mensaje: string = ""
  enviando = false

  constructor(private router: Router, private fb: FormBuilder, private usuarioService: ZUsuarioService) { }

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
      if (res != true) {
        this.mensaje = "El correo o la contraseña no son correctos."
        return
      }
      // Rol 3 = portería (solo el control de acceso); rol 2 = administración.
      const rol = this.usuarioService.usuario.id_rol
      if (rol == 3) {
        this.router.navigateByUrl('/admin/menu-puerta')
      } else if (rol == 2) {
        this.router.navigateByUrl('/admin/dashboard')
      } else {
        this.mensaje = "Esta cuenta no tiene acceso al backoffice."
      }
    }, (err: HttpErrorResponse) => {
      this.enviando = false
      this.mensaje = err.status == 500 ? "Error de servidor, intenta más tarde." : "No pudimos iniciar sesión. Inténtalo de nuevo."
    })
  }
}
