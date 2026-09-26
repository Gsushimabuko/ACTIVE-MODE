import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';
import { iconoCurso } from '../../icono-curso';

// Tipos de usuario que definen la tarifa (misma regla que el registro: 1 colegio, 2 externo, 3 personal).
const TIPOS_USUARIO = [1, 2, 3];

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.css']
})
export class CursoDetalleComponent {
  curso?: CursoPeriodo;
  periodo?: Date;
  desde: number | null = null;
  cargando = true;
  error = false;
  invitado: boolean;
  iconoCurso = iconoCurso;

  constructor(route: ActivatedRoute, usuarioService: ZUsuarioService, cursoService: ZCursoService) {
    const idCursoPeriodo = Number(route.snapshot.paramMap.get('idCursoPeriodo'));
    const q = route.snapshot.queryParamMap;
    const mes = Number(q.get('mes'));
    const ano = Number(q.get('ano'));
    const idCurso = Number(q.get('idCurso'));
    this.periodo = new Date(ano, mes, 1);

    // El invitado todavía no dijo su relación con el colegio: se muestra la tarifa más baja de todas.
    const usuario = usuarioService.usuario;
    this.invitado = !usuario.id;
    const tipos = this.invitado ? TIPOS_USUARIO : [usuario.id_tipo_usuario];

    forkJoin(tipos.map((tipo) => cursoService.getCursoHorarios(tipo, mes, ano, idCurso, idCursoPeriodo))).subscribe({
      next: (respuestas) => {
        const cursos = respuestas.map((r) => r[0]).filter(Boolean);
        this.curso = cursos.find((c) => c.niveles?.length) ?? cursos[0];
        const montos = cursos.flatMap((c) => (c.niveles ?? []).flatMap((n) => n.ratios.map((r) => r.payment)));
        this.desde = montos.length ? Math.min(...montos) : null;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }
}
