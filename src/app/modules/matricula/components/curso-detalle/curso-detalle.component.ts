import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';
import { iconoCurso } from '../../icono-curso';

// Tipos de usuario que definen la tarifa (misma regla que el registro: 1 colegio, 2 externo, 3 personal).
const TIPOS_USUARIO = [1, 2, 3];

// "2 – 3" si hay varios valores, "2" si hay uno, null si no hay.
const rango = (valores: number[]) => {
  const v = valores.filter((n) => n > 0);
  if (!v.length) return null;
  const a = Math.min(...v), b = Math.max(...v);
  return a === b ? `${a}` : `${a} – ${b}`;
};

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle.component.html',
  styleUrls: ['./curso-detalle.component.css']
})
export class CursoDetalleComponent {
  curso?: CursoPeriodo;
  periodo?: Date;
  desde: number | null = null;
  diasSemana: string | null = null;
  clasesMes: string | null = null;
  ocupacion: number | null = null;
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
        const ratios = cursos.flatMap((c) => (c.niveles ?? []).flatMap((n) => n.ratios));
        const montos = ratios.map((r) => r.payment);
        this.desde = montos.length ? Math.min(...montos) : null;
        // "1 vez", "2 veces": el número del nombre es cuántos días a la semana.
        this.diasSemana = rango(ratios.map((r) => parseInt(String(r.ratio).replace(/^\D+/, ''), 10)));
        this.clasesMes = rango(ratios.flatMap((r) => r.dias.map((d) => d.numEvents)));
        this.ocupacion = this.calcularOcupacion();
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }

  // Inscritos sobre el cupo de todas las clases del mes (cada clase cuenta una vez).
  private calcularOcupacion(): number | null {
    const cupo = this.curso?.cupoMax;
    if (!this.curso || !cupo) return null;
    const clases = new Map<number, number>();
    for (const n of this.curso.niveles ?? [])
      for (const r of n.ratios)
        for (const d of r.dias)
          for (const h of d.schedule) clases.set(h.idHorario, h.number);
    if (!clases.size) return null;
    const inscritos = [...clases.values()].reduce((a, b) => a + b, 0);
    return Math.min(100, Math.round((inscritos / (clases.size * cupo)) * 100));
  }

  get notaOcupacion() {
    if (this.curso?.state === 'CERRADO') return 'Este grupo ya está completo o sus clases ya pasaron.';
    return (this.ocupacion ?? 0) >= 80 ? 'Se está llenando rápido. Asegura tu cupo.' : 'Aún hay cupos disponibles para este periodo.';
  }

  // Lleva a Matrícula con este periodo y este curso ya elegidos.
  get matricula() {
    return { idCurso: this.curso?.idCurso, periodo: this.periodo?.toISOString() };
  }
}
