import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, mensajesDeError } from 'src/app/core/http/admin/admin.service';

// Crear o editar un curso del catálogo con su ficha (lo que ve la familia en la página del curso).
@Component({
  selector: 'app-catalogo-editor',
  templateUrl: './catalogo-editor.component.html',
  styleUrls: ['./catalogo-editor.component.css']
})
export class CatalogoEditorComponent {
  id: number | null;
  nombre = '';
  activo = true;
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

  constructor(route: ActivatedRoute, private router: Router, private admin: AdminService) {
    const id = route.snapshot.paramMap.get('id');
    this.id = id ? Number(id) : null;
    if (!this.id) return;
    this.cargando = true;
    admin.cursoCatalogo(this.id).subscribe({
      next: (c) => {
        Object.assign(this, {
          nombre: c.nombre, activo: c.estado === 'ACTIVO', categoria: c.categoria ?? '', edades: c.edades ?? '',
          resumen: c.resumen ?? '', descripcion: c.descripcion ?? '', imagen: c.imagen ?? '',
          plan: c.plan.map((p) => ({ ...p })), periodos: c.periodos,
        });
        this.cargando = false;
      },
      error: (e) => { this.errores = mensajesDeError(e); this.cargando = false; },
    });
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

  guardar() {
    this.errores = [];
    this.guardando = true;
    this.admin.guardarCursoCatalogo(this.id, {
      nombre: this.nombre, estado: this.activo ? 'ACTIVO' : 'INACTIVO', categoria: this.categoria, edades: this.edades,
      resumen: this.resumen, descripcion: this.descripcion, imagen: this.imagen,
      // Pasos vacíos al final no se guardan.
      plan: this.plan.filter((p) => p.titulo.trim() || p.detalle.trim()),
    }).subscribe({
      next: (c) => {
        this.guardando = false;
        this.router.navigate(['/admin/catalogo'], { state: { aviso: `${c.nombre}: ${this.id ? 'cambios guardados' : 'agregado al catálogo'}.` } });
      },
      error: (e) => { this.guardando = false; this.errores = mensajesDeError(e); },
    });
  }
}
