import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import {
  AdminService, CursoPeriodoAdmin, mensajesDeError, OpcionesCursoPeriodo, PeriodoAdmin,
} from 'src/app/core/http/admin/admin.service';
import { etiquetaPeriodo } from '../selector-periodo/selector-periodo.component';
import { clasesEnElMes, DIAS_CORTOS, franja, ORDEN_SEMANA, textoDias } from '../horario';

type Frecuencia = OpcionesCursoPeriodo['frecuencias'][number];

// Abrir un curso del catálogo en un periodo, o editar uno ya abierto.
// Rutas: curso-periodo/nuevo?idPeriodo=, curso-periodo/:id y la antigua creacion-form/:periodoId.
@Component({
  selector: 'app-creacion-curso-periodo',
  templateUrl: './creacion-curso-periodo.component.html',
  styleUrls: ['./creacion-curso-periodo.component.css']
})
export class CreacionCursoPeriodoComponent {
  id: number | null = null;
  opciones?: OpcionesCursoPeriodo;
  periodos: PeriodoAdmin[] = [];
  existente?: CursoPeriodoAdmin;
  // Cursos ya abiertos en el periodo elegido (sin contar este): no se pueden repetir.
  abiertos = new Set<number>();

  idCurso: number | null = null;
  idPeriodo: number | null = null;
  profesor = '';
  cupo: number | null = null;
  dias: number[] = [];
  niveles: number[] = [];
  montos: Record<string, number | null> = {};

  cargando = true;
  guardando = false;
  errores: string[] = [];

  readonly semana = ORDEN_SEMANA;
  readonly diaCorto = DIAS_CORTOS;
  readonly franja = franja;
  readonly etiqueta = etiquetaPeriodo;

  constructor(route: ActivatedRoute, private router: Router, private admin: AdminService) {
    const p = route.snapshot.paramMap;
    this.id = p.get('id') ? Number(p.get('id')) : null;
    const periodoPedido = Number(p.get('periodoId') || route.snapshot.queryParamMap.get('idPeriodo')) || null;

    forkJoin({
      opciones: admin.opcionesCursoPeriodo(),
      periodos: admin.periodos(),
      existente: this.id ? admin.cursoPeriodo(this.id) : of(undefined),
    }).subscribe({
      next: ({ opciones, periodos, existente }) => {
        this.opciones = opciones;
        this.periodos = periodos;
        if (existente) {
          this.existente = existente;
          this.idCurso = existente.idCurso;
          this.idPeriodo = existente.idPeriodo;
          this.profesor = existente.profesor;
          this.cupo = existente.cupo;
          this.dias = [...existente.dias];
          this.niveles = existente.niveles.map((n) => n.id);
          for (const t of existente.tarifas) this.montos[this.clave(t.idDia, t.idTipoUsuario)] = t.monto;
        } else {
          this.idPeriodo = periodoPedido ?? periodos.find((x) => x.estado === 'ACTIVO')?.id ?? periodos[0]?.id ?? null;
        }
        this.cargando = false;
        this.cargarAbiertos();
      },
      error: (e) => {
        this.cargando = false;
        this.errores = mensajesDeError(e);
      },
    });
  }

  get editando() { return !!this.id; }
  // Con alumnos inscritos no se toca lo que define sus clases: curso, periodo y días.
  get conInscritos() { return (this.existente?.inscritos ?? 0) > 0; }
  get periodo() { return this.periodos.find((p) => p.id === this.idPeriodo); }
  get clasesMes() { return this.periodo ? clasesEnElMes(this.periodo.ano, this.periodo.mes, this.dias) : 0; }
  get textoDias() { return textoDias(this.dias); }

  clave(idDia: number, idTipo: number) { return `${idDia}-${idTipo}`; }

  cambiarPeriodo(id: number) {
    this.idPeriodo = id;
    this.cargarAbiertos();
  }

  private cargarAbiertos() {
    if (!this.idPeriodo) return;
    this.admin.cursosDePeriodo(this.idPeriodo).subscribe({
      next: ({ cursos }) => (this.abiertos = new Set(cursos.filter((c) => c.id !== this.id).map((c) => c.idCurso))),
      error: () => (this.abiertos = new Set()),
    });
  }

  alternarDia(d: number) {
    this.dias = this.dias.includes(d) ? this.dias.filter((x) => x !== d) : [...this.dias, d];
  }

  inscritosEnNivel(id: number) { return this.existente?.niveles.find((n) => n.id === id)?.inscritos ?? 0; }

  alternarNivel(id: number) {
    if (this.niveles.includes(id)) {
      if (this.inscritosEnNivel(id)) return; // tiene alumnos: no se quita
      this.niveles = this.niveles.filter((x) => x !== id);
    } else {
      this.niveles = [...this.niveles, id];
    }
  }

  // Qué días podrá elegir la familia con esta frecuencia (misma regla que el portal).
  gruposPara(f: Frecuencia) { return f.grupos.filter((g) => g.dias.every((d) => this.dias.includes(d))).map((g) => g.nombre); }
  disponible(f: Frecuencia) { return f.veces <= this.dias.length && this.gruposPara(f).length > 0; }

  matriculasDeTarifa(idDia: number, idTipo: number) {
    return this.existente?.tarifas.find((t) => t.idDia === idDia && t.idTipoUsuario === idTipo)?.matriculas ?? 0;
  }

  get tarifas() {
    return Object.entries(this.montos)
      .filter(([, monto]) => monto !== null && monto !== undefined && String(monto) !== '')
      .map(([clave, monto]) => {
        const [idDia, idTipoUsuario] = clave.split('-').map(Number);
        return { idDia, idTipoUsuario, monto: Number(monto) };
      });
  }

  get desde() {
    const montos = this.tarifas.map((t) => t.monto).filter((m) => m > 0);
    return montos.length ? Math.min(...montos) : null;
  }

  guardar() {
    this.errores = [];
    this.guardando = true;
    const datos = {
      idCurso: this.idCurso, idPeriodo: this.idPeriodo, profesor: this.profesor, cupo: this.cupo,
      dias: this.dias, niveles: this.niveles, tarifas: this.tarifas,
    };
    this.admin.guardarCursoPeriodo(this.id, datos).subscribe({
      next: () => {
        this.guardando = false;
        const curso = this.opciones?.cursos.find((c) => c.id === this.idCurso)?.nombre ?? 'El curso';
        this.router.navigate(['/admin/creacion'], {
          queryParams: { idPeriodo: this.idPeriodo },
          state: { aviso: `${curso}: ${this.editando ? 'cambios guardados' : 'abierto en el periodo'}.` },
        });
      },
      error: (e) => {
        this.guardando = false;
        this.errores = mensajesDeError(e);
      },
    });
  }
}
