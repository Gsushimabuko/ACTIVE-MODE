import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, CursoDePeriodo, mensajesDeError, PeriodoAdmin } from 'src/app/core/http/admin/admin.service';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';
import { etiquetaPeriodo, MESES } from '../selector-periodo/selector-periodo.component';
import { textoDias } from '../horario';

// Cursos por periodo: qué cursos del catálogo están abiertos en cada mes y si el mes lo ven las familias.
@Component({
  selector: 'app-creacion-cursos',
  templateUrl: './creacion-cursos.component.html',
  styleUrls: ['./creacion-cursos.component.css']
})
export class CreacionCursosComponent {
  periodos: PeriodoAdmin[] = [];
  periodo?: PeriodoAdmin;
  cursos: CursoDePeriodo[] = [];
  cargando = true;
  ocupado = false;
  aviso = '';
  errores: string[] = [];

  // Nuevo periodo
  creandoPeriodo = false;
  nuevoMes = 1;
  nuevoAno = new Date().getFullYear();
  nuevoVisible = false;
  // Copiar cursos
  idOrigen: number | null = null;

  readonly meses = MESES;
  readonly etiqueta = etiquetaPeriodo;
  readonly textoDias = textoDias;

  constructor(private admin: AdminService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.aviso = history.state?.aviso ?? '';
    const q = route.snapshot.queryParamMap;
    const pedido = Number(q.get('idPeriodo')) || null;
    // Enlaces antiguos: ?mes=&ano=
    const mes = Number(q.get('mes')), ano = Number(q.get('ano'));
    this.cargarPeriodos((ps) => pedido ?? ps.find((p) => p.mes === mes && p.ano === ano)?.id ?? this.periodoPorDefecto(ps));
  }

  // El mes actual si existe; si no, el siguiente que exista; si no, el más reciente.
  private periodoPorDefecto(ps: PeriodoAdmin[]) {
    const hoy = new Date();
    const actual = hoy.getFullYear() * 12 + hoy.getMonth() + 1;
    const futuros = ps.filter((p) => p.ano * 12 + p.mes >= actual).sort((a, b) => a.ano * 12 + a.mes - (b.ano * 12 + b.mes));
    return futuros[0]?.id ?? ps[0]?.id;
  }

  private cargarPeriodos(elegir: (ps: PeriodoAdmin[]) => number | undefined) {
    this.cargando = true;
    this.admin.periodos().subscribe({
      next: (ps) => {
        this.periodos = ps;
        const id = elegir(ps);
        if (id) this.elegirPeriodo(id); else this.cargando = false;
      },
      error: (e) => { this.cargando = false; this.errores = mensajesDeError(e); },
    });
  }

  elegirPeriodo(id: number) {
    this.periodo = this.periodos.find((p) => p.id === id);
    this.router.navigate([], { queryParams: { idPeriodo: id }, replaceUrl: true });
    this.cargarCursos();
  }

  cargarCursos() {
    if (!this.periodo) return;
    this.cargando = true;
    this.admin.cursosDePeriodo(this.periodo.id).subscribe({
      next: ({ periodo, cursos }) => {
        Object.assign(this.periodo!, periodo);
        this.cursos = cursos;
        this.idOrigen = this.periodos.find((p) => p.id !== periodo.id && (p.cursos ?? 0) > 0)?.id ?? null;
        this.cargando = false;
      },
      error: (e) => { this.cargando = false; this.errores = mensajesDeError(e); },
    });
  }

  get pasado() {
    if (!this.periodo) return false;
    const hoy = new Date();
    return this.periodo.ano * 12 + this.periodo.mes < hoy.getFullYear() * 12 + hoy.getMonth() + 1;
  }

  get origenes() { return this.periodos.filter((p) => p.id !== this.periodo?.id && (p.cursos ?? 0) > 0); }
  get hayRepetidos() { return this.cursos.some((c) => c.repetido); }

  // Ejecuta una acción que cambia datos y recarga, mostrando el resultado arriba.
  private hacer(obs: any, aviso: string, recargarPeriodos = false) {
    this.ocupado = true;
    this.errores = [];
    this.aviso = '';
    obs.subscribe({
      next: () => {
        this.ocupado = false;
        this.aviso = aviso;
        if (recargarPeriodos) this.cargarPeriodos(() => this.periodo?.id); else this.cargarCursos();
      },
      error: (e: any) => { this.ocupado = false; this.errores = mensajesDeError(e); },
    });
  }

  cambiarVisibilidadPeriodo() {
    const p = this.periodo!;
    const abrir = p.estado !== 'ACTIVO';
    this.hacer(this.admin.estadoPeriodo(p.id, abrir ? 'ACTIVO' : 'INACTIVO'),
      abrir ? `${this.etiqueta(p)} ya es visible para las familias.` : `${this.etiqueta(p)} quedó oculto para las familias.`, true);
  }

  abrirNuevoPeriodo() {
    // Propone el mes siguiente al más reciente.
    const ultimo = this.periodos[0];
    const base = ultimo ? new Date(ultimo.ano, ultimo.mes, 1) : new Date();
    this.nuevoMes = base.getMonth() + 1;
    this.nuevoAno = base.getFullYear();
    this.nuevoVisible = false;
    this.creandoPeriodo = true;
  }

  crearPeriodo() {
    this.ocupado = true;
    this.errores = [];
    const estado = this.nuevoVisible ? 'ACTIVO' : 'INACTIVO';
    this.admin.crearPeriodo(this.nuevoMes, this.nuevoAno, estado).subscribe({
      next: (p) => {
        this.ocupado = false;
        this.creandoPeriodo = false;
        this.aviso = this.nuevoVisible
          ? `${this.etiqueta(p)} creado y visible para las familias.`
          : `${this.etiqueta(p)} creado. Está oculto: agrega o copia cursos y luego ábrelo a las familias.`;
        this.cargarPeriodos(() => p.id);
      },
      error: (e) => { this.ocupado = false; this.errores = mensajesDeError(e); },
    });
  }

  copiar() {
    if (!this.idOrigen || !this.periodo) return;
    const origen = this.periodos.find((p) => p.id === this.idOrigen)!;
    this.hacer(this.admin.copiarCursos(this.periodo.id, this.idOrigen), `Se copiaron los cursos de ${this.etiqueta(origen)}. Revisa las fechas antes de mostrarlos.`, true);
  }

  cambiarVisibilidadCurso(c: CursoDePeriodo) {
    const mostrar = c.estado === 'INACTIVO';
    this.hacer(this.admin.estadoCursoPeriodo(c.id, mostrar ? 'ACTIVO' : 'INACTIVO'),
      `${this.nombre(c)} ${mostrar ? 'vuelve a mostrarse' : 'quedó oculto'} en este periodo.`);
  }

  eliminar(c: CursoDePeriodo) {
    this.dialog.open(ConfirmarDialogComponent, {
      width: '440px', panelClass: 'am-dialogo',
      data: {
        titulo: `¿Eliminar ${this.nombre(c)} de ${this.etiqueta(this.periodo)}?`,
        mensaje: 'Se borran sus clases y tarifas de este mes. El curso sigue en el catálogo.',
        confirmar: 'Eliminar', peligro: true,
      },
    }).afterClosed().subscribe((ok) => {
      if (ok) this.hacer(this.admin.eliminarCursoPeriodo(c.id), `${this.nombre(c)} se eliminó de este periodo.`, true);
    });
  }

  nombre(c: CursoDePeriodo) {
    return c.nombre.charAt(0) + c.nombre.slice(1).toLowerCase();
  }
}
