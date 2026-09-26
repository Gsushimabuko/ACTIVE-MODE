import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  form = this.fb.group({ correo: ['', [Validators.required, Validators.email]] });
  estado: 'form' | 'enviando' | 'enviado' = 'form';
  error = false;

  constructor(private fb: FormBuilder, private usuarioService: ZUsuarioService) { }

  get invalido(): boolean {
    const c = this.form.controls.correo;
    return c.invalid && c.touched;
  }

  enviar() {
    this.error = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.estado = 'enviando';
    this.usuarioService.enviarCorreoContrasena({ correo: this.form.value.correo!.toLowerCase() }).subscribe({
      next: () => (this.estado = 'enviado'),
      error: (err: HttpErrorResponse) => {
        // 404 = correo no registrado. Se responde igual que si existiera, para no revelar qué correos tienen cuenta.
        if (err.status === 404) {
          this.estado = 'enviado';
          return;
        }
        this.estado = 'form';
        this.error = true;
      },
    });
  }
}
