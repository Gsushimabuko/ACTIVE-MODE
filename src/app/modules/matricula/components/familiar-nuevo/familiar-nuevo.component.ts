import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-familiar-nuevo',
  templateUrl: './familiar-nuevo.component.html',
  styleUrls: ['./familiar-nuevo.component.css']
})
export class FamiliarNuevoComponent {
  listaSexos = ['Masculino', 'Femenino', 'No desea especificar'];
  listaRelaciones = ['Externo', 'Alumno del colegio', 'Ex Alumno del colegio', 'Miembro de la cooperativa', 'Personal', 'Padre de familia', 'Otro'];
  hoy = new Date().toISOString().slice(0, 10);
  mensajeError = '';
  guardando = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    dob: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    direccion: ['', [Validators.required]],
    relacion: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: ZUsuarioService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && c.touched;
  }

  // Misma regla que usaba el formulario anterior para elegir la tarifa.
  private tipoUsuario(relacion: string): number {
    if (relacion === 'Personal') return 3;
    if (relacion === 'Externo' || relacion === 'Otro') return 2;
    return 1;
  }

  guardar() {
    this.mensajeError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Revisa los campos marcados.';
      return;
    }
    this.guardando = true;
    const v = this.form.getRawValue();
    const familiar = {
      ...v,
      id_codigo: 1,
      id_rol: 1,
      id_tipo_usuario: this.tipoUsuario(v.relacion!),
      id_padre: this.usuarioService.usuario.id,
    };

    this.usuarioService.createRelativo(familiar).subscribe({
      next: () => {
        this.snackbar.open('Familiar guardado', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/matricula/familia']);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.mensajeError = err.error?.message
          || (err.status === 500 ? 'Ese DNI ya está registrado.' : 'No pudimos guardar al familiar. Inténtalo de nuevo.');
      },
    });
  }
}
