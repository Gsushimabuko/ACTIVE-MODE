import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { ImagenService } from 'src/app/core/http/imagen/imagen.service';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursoMatriculado } from 'src/app/modules/shared/interfaces/Curso';
import { FamiliarEliminarDialogComponent } from '../familiar-eliminar-dialog/familiar-eliminar-dialog.component';
import { iconoCurso } from '../../icono-curso';

@Component({
  selector: 'app-familiar-detalle',
  templateUrl: './familiar-detalle.component.html',
  styleUrls: ['./familiar-detalle.component.css']
})
export class FamiliarDetalleComponent implements OnDestroy {
  miembro?: Usuario;
  esTitular = false;
  mes = new Date();
  cursos: CursoMatriculado[] = [];
  cargando = true;
  editando = false;
  guardando = false;
  eliminando = false;
  mensajeError = '';
  fotoArchivo?: File;
  fotoVista: SafeUrl | string = '';
  fotoEliminada = false;
  private fotoObjectUrl = '';
  private readonly id: number;
  iconoCurso = iconoCurso;
  hoy = new Date().toISOString().slice(0, 10);
  listaSexos = ['Masculino', 'Femenino', 'No desea especificar'];
  listaRelaciones = ['Externo', 'Alumno del colegio', 'Ex Alumno del colegio', 'Miembro de la cooperativa', 'Personal', 'Padre de familia', 'Otro'];

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.minLength(8)]],
    dob: ['', Validators.required],
    sexo: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', Validators.required],
    relacion: ['', Validators.required],
  });

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: ZUsuarioService,
    private cursoService: ZCursoService,
    private imagenService: ImagenService,
    private sanitizer: DomSanitizer,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.id = Number(route.snapshot.paramMap.get('id'));
    this.esTitular = this.id === usuarioService.usuario.id;
    this.cargar();
  }

  ngOnDestroy() {
    this.liberarObjectUrl();
  }

  private cargar() {
    this.usuarioService.getRelatives(this.usuarioService.usuario.id).subscribe({
      next: (familia) => {
        this.miembro = familia.find((m) => m.id === this.id);
        if (!this.miembro) {
          this.cargando = false;
          return;
        }
        this.cursoService.getCursosHorariosMatriculados(this.id, this.mes.getMonth(), this.mes.getFullYear()).subscribe({
          next: (cursos) => {
            this.cursos = cursos;
            this.cargando = false;
          },
          error: () => (this.cargando = false),
        });
      },
      error: () => (this.cargando = false),
    });
  }

  iniciarEdicion() {
    if (!this.miembro || this.esTitular) return;
    this.mensajeError = '';
    this.fotoArchivo = undefined;
    this.fotoEliminada = false;
    this.fotoVista = this.miembro.foto || '';
    this.form.reset({
      nombre: this.miembro.nombre,
      apellidop: this.miembro.apellidop,
      apellidom: this.miembro.apellidom,
      dni: this.miembro.dni,
      dob: this.miembro.dob ? String(this.miembro.dob).slice(0, 10) : '',
      sexo: this.miembro.sexo,
      telefono: this.miembro.telefono,
      direccion: this.miembro.direccion,
      relacion: this.miembro.relacion || '',
    });
    this.editando = true;
  }

  cancelarEdicion(input?: HTMLInputElement) {
    this.liberarObjectUrl();
    this.fotoArchivo = undefined;
    this.fotoVista = '';
    this.fotoEliminada = false;
    this.mensajeError = '';
    if (input) input.value = '';
    this.editando = false;
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    this.mensajeError = '';
    if (!archivo) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type) || archivo.size > 5 * 1024 * 1024) {
      this.mensajeError = 'Elige una imagen JPG, PNG o WebP de hasta 5 MB.';
      input.value = '';
      return;
    }
    this.liberarObjectUrl();
    this.fotoArchivo = archivo;
    this.fotoEliminada = false;
    this.fotoObjectUrl = URL.createObjectURL(archivo);
    this.fotoVista = this.sanitizer.bypassSecurityTrustUrl(this.fotoObjectUrl);
  }

  quitarFoto(input: HTMLInputElement) {
    this.liberarObjectUrl();
    this.fotoArchivo = undefined;
    this.fotoVista = '';
    this.fotoEliminada = true;
    input.value = '';
  }

  private liberarObjectUrl() {
    if (this.fotoObjectUrl) URL.revokeObjectURL(this.fotoObjectUrl);
    this.fotoObjectUrl = '';
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo)!;
    return control.invalid && control.touched;
  }

  guardar() {
    if (!this.miembro || this.form.invalid || this.guardando) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    this.mensajeError = '';
    const foto$: Observable<{ url: string | null }> = this.fotoArchivo
      ? this.imagenService.subir(this.fotoArchivo)
      : of({ url: this.fotoEliminada ? null : (this.miembro.foto || null) });

    foto$.pipe(
      switchMap(({ url }) => this.usuarioService.updateRelativo(this.id, { ...this.form.getRawValue(), foto: url }))
    ).subscribe({
      next: ({ usuario }) => {
        this.miembro = { ...this.miembro!, ...usuario };
        this.guardando = false;
        this.cancelarEdicion();
        this.snackbar.open('Datos del familiar actualizados', 'Cerrar', { duration: 4000 });
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.mensajeError = err.error?.message || err.error?.mensaje || 'No pudimos actualizar al familiar.';
      },
    });
  }

  confirmarEliminacion() {
    if (!this.miembro || this.esTitular || this.eliminando) return;
    this.dialog.open(FamiliarEliminarDialogComponent, {
      width: '440px',
      maxWidth: 'calc(100vw - 32px)',
      data: { nombre: `${this.miembro.nombre} ${this.miembro.apellidop}` },
    }).afterClosed().subscribe(confirmado => {
      if (!confirmado) return;
      this.eliminando = true;
      this.usuarioService.deleteRelativo(this.id).subscribe({
        next: () => {
          this.snackbar.open('Familiar eliminado', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/matricula/familia']);
        },
        error: (err: HttpErrorResponse) => {
          this.eliminando = false;
          this.mensajeError = err.error?.message || 'No pudimos eliminar al familiar.';
        },
      });
    });
  }

  get iniciales(): string {
    return ((this.miembro?.nombre?.[0] ?? '') + (this.miembro?.apellidop?.[0] ?? '')).toUpperCase();
  }
}
