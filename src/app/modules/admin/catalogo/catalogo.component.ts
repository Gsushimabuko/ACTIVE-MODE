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
  readonly porPagina = 12;
  pagina = 1;
  mostrarArchivados = false;

  constructor(admin: AdminService) {
    admin.catalogo().subscribe({
      next: (c) => { this.cursos = c; this.cargando = false; },
      error: (e) => { this.errores = mensajesDeError(e); this.cargando = false; },
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.cursosFiltrados.length / this.porPagina);
  }

  get archivados(): number { return this.cursos.filter((c) => c.estado === 'ARCHIVADO').length; }

  get cursosFiltrados(): FichaCurso[] {
    return this.cursos.filter((c) => this.mostrarArchivados ? c.estado === 'ARCHIVADO' : c.estado !== 'ARCHIVADO');
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get cursosPagina(): FichaCurso[] {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.cursosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  alternarArchivados() {
    this.mostrarArchivados = !this.mostrarArchivados;
    this.pagina = 1;
  }

  irAPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.pagina) return;
    this.pagina = pagina;
  }

  // Lo que le falta a la ficha para verse completa en el portal.
  faltantes(c: FichaCurso) {
    return [
      !c.imagen && 'foto', !c.resumen && 'resumen', !c.descripcion && 'descripción', !c.plan?.length && 'plan',
    ].filter(Boolean) as string[];
  }
}
