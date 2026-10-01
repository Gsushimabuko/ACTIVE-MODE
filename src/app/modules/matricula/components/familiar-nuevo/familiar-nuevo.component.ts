import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, switchMap } from 'rxjs';
import { ImagenService } from 'src/app/core/http/imagen/imagen.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-familiar-nuevo',
  templateUrl: './familiar-nuevo.component.html',
  styleUrls: ['./familiar-nuevo.component.css']
})
export class FamiliarNuevoComponent implements OnDestroy {
  listaSexos = ['Masculino', 'Femenino', 'No desea especificar'];
  listaRelaciones = ['Externo', 'Alumno del colegio', 'Ex Alumno del colegio', 'Miembro de la cooperativa', 'Personal', 'Padre de familia', 'Otro'];
  hoy = new Date().toISOString().slice(0, 10);
  mensajeError = '';
  guardando = false;
  fotoArchivo?: File;
  fotoVista: SafeUrl | '' = '';
  private fotoObjectUrl = '';
  mensajeFoto = '';

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.minLength(8)]],
    dob: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required]],
    relacion: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: ZUsuarioService,
    private imagenService: ImagenService,
    private router: Router,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnDestroy() {
    this.liberarVistaPrevia();
  }

  private liberarVistaPrevia() {
    if (this.fotoObjectUrl) URL.revokeObjectURL(this.fotoObjectUrl);
    this.fotoObjectUrl = '';
    this.fotoVista = '';
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    this.mensajeFoto = '';
    if (!archivo) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
      this.mensajeFoto = 'Usa una imagen JPG, PNG o WebP.';
      input.value = '';
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      this.mensajeFoto = 'La imagen no puede superar los 5 MB.';
      input.value = '';
      return;
    }
    this.liberarVistaPrevia();
    this.fotoArchivo = archivo;
    this.fotoObjectUrl = URL.createObjectURL(archivo);
    // La URL proviene del File seleccionado por el propio usuario. Angular
    // bloquea algunos blob: en bindings de imagen si no se marca su origen.
    this.fotoVista = this.sanitizer.bypassSecurityTrustUrl(this.fotoObjectUrl);
  }

  quitarFoto(input: HTMLInputElement) {
    this.liberarVistaPrevia();
    this.fotoArchivo = undefined;
    this.mensajeFoto = '';
    input.value = '';
  }

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
    const foto$: Observable<{ url: string | null }> = this.fotoArchivo
      ? this.imagenService.subir(this.fotoArchivo)
      : of({ url: null });
    foto$.pipe(
      switchMap(({ url }) => this.usuarioService.createRelativo({
        ...v,
        id_codigo: 1,
        id_rol: 1,
        id_tipo_usuario: this.tipoUsuario(v.relacion!),
        id_padre: this.usuarioService.usuario.id,
        foto: url,
      }))
    ).subscribe({
      next: () => {
        this.snackbar.open('Familiar guardado', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/matricula/familia']);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.mensajeError = err.error?.mensaje || err.error?.message
          || (err.status === 500 ? 'Ese DNI ya está registrado.' : 'No pudimos guardar al familiar. Inténtalo de nuevo.');
      },
    });
  }
}
