import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  constructor(
    private usuarioService: ZUsuarioService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    ) {
      this.route.queryParams.subscribe(params => {
        this.token = params['token'];
    });

      this.contrasenaForm.addValidators(
        this.crearValidadorComparador(
          this.contrasenaForm.get('contrasena')!!,
          this.contrasenaForm.get('contrasena2')!!
        )
      );
    }

  contrasenaForm = this._fb.group({
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    contrasena2: ['', [Validators.required, Validators.minLength(6)]],
  });

  error: boolean = false;
  token: string = '';
  cambio: boolean = false;

  crearValidadorComparador(control1: AbstractControl, control2: AbstractControl) {
    return () => {
      if (control1.value !== control2.value) {
        control2.setErrors({ matchError: true });
        return { matchError: 'Las contraseñas no coinciden' };
      }

      return null;
    };
  }

  cambiarContrasena() {
    this.error = false;

    if (this.contrasenaForm.invalid) {
      this.contrasenaForm.markAllAsTouched();
      return;
    }
    
    this.usuarioService.cambiarContrasena(this.contrasenaForm.value, this.token).subscribe({
      next: (result: any) => {
        if (result.ok) {
          this.cambio = true;

        } else {
          this.error = true;
        }
      },
      error: (err: any) => {
        this.error = true;
      }
    });
  }
}
