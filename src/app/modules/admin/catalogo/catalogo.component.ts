import { Component } from '@angular/core';
import { AdminService, FichaCurso, mensajesDeError } from 'src/app/core/http/admin/admin.service';
import { iconoCurso } from '../../matricula/icono-curso';

// Catálogo: los cursos que existen y la ficha que ven las familias.
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  cursos: FichaCurso[] = [];
  cargando = true;
  errores: string[] = [];
  aviso: string = history.state?.aviso ?? '';
  readonly icono = iconoCurso;

  constructor(admin: AdminService) {
    admin.catalogo().subscribe({
      next: (c) => { this.cursos = c; this.cargando = false; },
      error: (e) => { this.errores = mensajesDeError(e); this.cargando = false; },
    });
  }

  // Lo que le falta a la ficha para verse completa en el portal.
  faltantes(c: FichaCurso) {
    return [
      !c.imagen && 'foto', !c.resumen && 'resumen', !c.descripcion && 'descripción', !c.plan?.length && 'plan',
    ].filter(Boolean) as string[];
  }
}
