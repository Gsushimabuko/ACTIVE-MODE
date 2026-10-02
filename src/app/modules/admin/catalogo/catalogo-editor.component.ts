import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, switchMap } from 'rxjs';
import { AdminService, mensajesDeError } from 'src/app/core/http/admin/admin.service';
import { ImagenService } from 'src/app/core/http/imagen/imagen.service';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';

// Crear o editar un curso del catálogo con su ficha (lo que ve la familia en la página del curso).
@Component({
  selector: 'app-catalogo-editor',
  templateUrl: './catalogo-editor.component.html',
  styleUrls: ['./catalogo-editor.component.css']
})
export class CatalogoEditorComponent implements OnDestroy {
  id: number | null;
  nombre = '';
  activo = true;
  archivado = false;
  categoria = '';
  edades = '';
  resumen = '';
  descripcion = '';
  imagen = '';
  plan: { titulo: string; detalle: string }[] = [];
  periodos = 0;
  cargando = false;
  guardando = false;
  errores: string[] = [];
  fotoRota = false;
  fotoArchivo?: File;
  fotoLocal = '';
  errorFoto = '';

  constructor(route: ActivatedRoute, private router: Router, private admin: AdminService, private imagenService: ImagenService, private dialog: MatDialog) {
    const id = route.snapshot.paramMap.get('id');
    this.id = id ? Number(id) : null;
    if (!this.id) return;
    this.cargando = true;
    admin.cursoCatalogo(this.id).subscribe({
      next: (c) => {
        Object.assign(this, {
          nombre: c.nombre, activo: c.estado === 'ACTIVO', archivado: c.estado === 'ARCHIVADO', categoria: c.categoria ?? '', edades: c.edades ?? '',
          resumen: c.resumen ?? '', descripcion: c.descripcion ?? '', imagen: c.imagen ?? '',
          plan: c.plan.map((p) => ({ ...p })), periodos: c.periodos,
        });
        this.cargando = false;
      },
      error: (e) => { this.errores = mensajesDeError(e); this.cargando = false; },
    });
  }

  ngOnDestroy() {
    if (this.fotoLocal) URL.revokeObjectURL(this.fotoLocal);
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    this.errorFoto = '';
    if (!archivo) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
      this.errorFoto = 'Usa una imagen JPG, PNG o WebP.';
      input.value = '';
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      this.errorFoto = 'La imagen no puede superar los 5 MB.';
      input.value = '';
      return;
    }
    if (this.fotoLocal) URL.revokeObjectURL(this.fotoLocal);
    this.fotoArchivo = archivo;
    this.fotoLocal = URL.createObjectURL(archivo);
    this.fotoRota = false;
  }

  quitarArchivo(input: HTMLInputElement) {
    if (this.fotoLocal) URL.revokeObjectURL(this.fotoLocal);
    this.fotoArchivo = undefined;
    this.fotoLocal = '';
    this.errorFoto = '';
    input.value = '';
  }

  agregarPaso() { this.plan = [...this.plan, { titulo: '', detalle: '' }]; }
  quitarPaso(i: number) { this.plan = this.plan.filter((_, j) => j !== i); }
  moverPaso(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= this.plan.length) return;
    const p = [...this.plan];
    [p[i], p[j]] = [p[j], p[i]];
    this.plan = p;
  }

  cambiarArchivo(archivar: boolean) {
    if (!this.id) return;
    const ejecutar = () => {
      this.guardando = true;
      this.errores = [];
      this.admin.archivarCurso(this.id!, archivar).subscribe({
        next: (c) => this.router.navigate(['/admin/catalogo'], {
          state: { aviso: archivar ? `${c.nombre} fue archivado.` : `${c.nombre} fue restaurado como inactivo.` },
        }),
        error: (e) => { this.guardando = false; this.errores = mensajesDeError(e); },
      });
    };
    if (!archivar) { ejecutar(); return; }
    this.dialog.open(ConfirmarDialogComponent, {
      width: '440px', panelClass: 'am-dialogo',
      data: {
        titulo: `¿Archivar ${this.nombre}?`,
        mensaje: 'Dejará de aparecer en el portal de familias y no podrá abrirse en periodos nuevos. Su historial se conservará.',
        confirmar: 'Archivar curso',
      },
    }).afterClosed().subscribe((ok) => { if (ok) ejecutar(); });
  }

  guardar() {
    this.errores = [];
    if (this.errorFoto) return;
    this.guardando = true;
    const imagen$: Observable<{ url: string }> = this.fotoArchivo
      ? this.imagenService.subir(this.fotoArchivo)
      : of({ url: this.imagen });
    imagen$.pipe(
      switchMap(({ url }) => {
        this.imagen = url;
        return this.admin.guardarCursoCatalogo(this.id, {
          nombre: this.nombre, estado: this.archivado ? 'ARCHIVADO' : this.activo ? 'ACTIVO' : 'INACTIVO', categoria: this.categoria, edades: this.edades,
          resumen: this.resumen, descripcion: this.descripcion, imagen: this.imagen,
          // Pasos vacíos al final no se guardan.
          plan: this.plan.filter((p) => p.titulo.trim() || p.detalle.trim()),
        });
      })
    ).subscribe({
      next: (c) => {
        this.guardando = false;
        this.router.navigate(['/admin/catalogo'], { state: { aviso: `${c.nombre}: ${this.id ? 'cambios guardados' : 'agregado al catálogo'}.` } });
      },
      error: (e) => { this.guardando = false; this.errores = mensajesDeError(e); },
    });
  }
}
