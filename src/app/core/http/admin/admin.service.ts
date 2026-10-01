import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { saveAs } from 'file-saver';
import { environment } from 'src/app/environments/environment';

export type EstadoPagoAdmin = 'pagado' | 'pendiente';

export interface PagoAdmin {
  id: number;
  ref: string | null;
  metodo: 'cobrana' | 'openpay';
  fecha: string;
  pagadoAt: string | null;
  monto: number;
  estado: EstadoPagoAdmin;
  titular: string;
  invitado: boolean;
  correo: string | null;
  detalle: { curso: string; alumno: string }[];
}

export interface CursoResumen {
  idCursoPeriodo: number;
  nombre: string;
  profesor: string;
  estado: string;
  cupoPorGrupo: number;
  alumnos: number;
  ocupacion: number;
}

export interface ResumenAdmin {
  periodo: { id: number; mes: number; ano: number; estado: string };
  kpis: {
    alumnos: number;
    matriculas: number;
    recaudado: number;
    pendientes: { cantidad: number; monto: number };
    cursosAbiertos: number;
    cursosTotal: number;
  };
  cursos: CursoResumen[];
  pagos: PagoAdmin[];
}

export interface FechaCurso {
  fecha: string;
  horarios: { id: number; nivel?: string; inscritos: number }[];
  inscritos: number;
}

export interface PeriodoAdmin { id: number; mes: number; ano: number; estado: string; cursos?: number }

export interface CursoDePeriodo {
  id: number; idCurso: number; nombre: string; profesor: string; cupo: number; estado: string; dias: number[];
  horarios: number; clases: number; clasesPendientes: boolean; desde: number | null; inscritos: number; repetido: boolean;
}

export interface TarifaForm { idDia: number; idTipoUsuario: number; monto: number | null }

export interface CursoPeriodoForm {
  idCurso: number | null; idPeriodo: number | null; profesor: string; cupo: number | null;
  dias: number[]; niveles: number[]; tarifas: TarifaForm[];
}

export interface CursoPeriodoAdmin {
  id: number; idCurso: number; idPeriodo: number; profesor: string; cupo: number; estado: string; dias: number[];
  niveles: { id: number; inscritos: number }[];
  tarifas: { id: number; idDia: number; idTipoUsuario: number; monto: number; matriculas: number }[];
  inscritos: number; maxPorClase: number;
}

export interface OpcionesCursoPeriodo {
  cursos: { id: number; nombre: string; activo: boolean }[];
  frecuencias: { id: number; nombre: string; veces: number; clasesMes: number | null; grupos: { nombre: string; dias: number[] }[] }[];
  tipos: { id: number; nombre: string }[];
  niveles: { id: number; nombre: string; hora: string; inicio: number; fin: number }[];
}

export interface FichaCurso {
  id: number; nombre: string; estado: string; descripcion: string | null; imagen: string | null; categoria: string | null;
  edades: string | null; resumen: string | null; plan: { titulo: string; detalle: string }[]; periodos: number;
}

// Error del backend de /admin/*: { mensaje, detalle[] }.
export function mensajesDeError(err: any): string[] {
  const e = err?.error;
  if (e?.detalle?.length) return e.detalle;
  if (e?.mensaje) return [e.mensaje];
  if (err?.status === 401 || err?.status === 403) return ['Tu sesión venció. Vuelve a iniciar sesión.'];
  return ['No se pudo completar. Revisa tu conexión e inténtalo de nuevo.'];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = environment.API_URL;

  constructor(private http: HttpClient) { }

  // Este endpoint exige sesión de administrador: se manda el token como en /renovar.
  getResumen(idPeriodo: number) {
    const headers = new HttpHeaders().set('jwt', localStorage.getItem('jwt') || '');
    return this.http.get<ResumenAdmin & { ok: boolean }>(this.api + '/admin/resumen', { headers, params: { idPeriodo } });
  }

  reconciliarPagos(idPeriodo: number) {
    return this.http.post<{ ok: boolean; revisados: number; actualizados: number; errores: number }>(
      this.api + '/admin/pagos/reconciliar', { idPeriodo }, this.sesion
    );
  }

  getFechasCurso(idCursoPeriodo: number) {
    return this.http.get<any>(this.api + '/curso-periodo/fechas', { params: { idCursoPeriodo } });
  }

  setFechasCurso(idCursoPeriodo: number, fechas: string[]) {
    return this.http.put<any>(this.api + '/curso-periodo/fechas', { idCursoPeriodo, fechas });
  }

  // --- Catálogo, periodos y cursos por periodo (rutas /admin/*: exigen sesión de administrador) ---

  private get sesion() {
    return { headers: new HttpHeaders().set('jwt', localStorage.getItem('jwt') || '') };
  }

  opcionesCursoPeriodo() {
    return this.http.get<OpcionesCursoPeriodo>(this.api + '/admin/curso-periodo/opciones', this.sesion);
  }

  periodos() {
    return this.http.get<{ periodos: PeriodoAdmin[] }>(this.api + '/admin/periodos', this.sesion).pipe(map((r) => r.periodos));
  }

  crearPeriodo(mes: number, ano: number, estado: 'ACTIVO' | 'INACTIVO') {
    return this.http.post<{ periodo: PeriodoAdmin }>(this.api + '/admin/periodos', { mes, ano, estado }, this.sesion).pipe(map((r) => r.periodo));
  }

  estadoPeriodo(id: number, estado: 'ACTIVO' | 'INACTIVO') {
    return this.http.put<any>(`${this.api}/admin/periodos/${id}/estado`, { estado }, this.sesion);
  }

  cursosDePeriodo(id: number) {
    return this.http.get<{ periodo: PeriodoAdmin; cursos: CursoDePeriodo[] }>(`${this.api}/admin/periodos/${id}/cursos`, this.sesion);
  }

  copiarCursos(idDestino: number, idOrigen: number) {
    return this.http.post<{ copiados: number }>(`${this.api}/admin/periodos/${idDestino}/copiar`, { idOrigen }, this.sesion);
  }

  cursoPeriodo(id: number) {
    return this.http.get<{ cursoPeriodo: CursoPeriodoAdmin }>(`${this.api}/admin/curso-periodo/${id}`, this.sesion).pipe(map((r) => r.cursoPeriodo));
  }

  guardarCursoPeriodo(id: number | null, datos: CursoPeriodoForm) {
    return id
      ? this.http.put<{ id: number }>(`${this.api}/admin/curso-periodo/${id}`, datos, this.sesion)
      : this.http.post<{ id: number }>(this.api + '/admin/curso-periodo', datos, this.sesion);
  }

  estadoCursoPeriodo(id: number, estado: 'ACTIVO' | 'INACTIVO') {
    return this.http.put<any>(`${this.api}/admin/curso-periodo/${id}/estado`, { estado }, this.sesion);
  }

  eliminarCursoPeriodo(id: number) {
    return this.http.delete<any>(`${this.api}/admin/curso-periodo/${id}`, this.sesion);
  }

  catalogo() {
    return this.http.get<{ cursos: FichaCurso[] }>(this.api + '/admin/cursos', this.sesion).pipe(map((r) => r.cursos));
  }

  cursoCatalogo(id: number) {
    return this.http.get<{ curso: FichaCurso }>(`${this.api}/admin/cursos/${id}`, this.sesion).pipe(map((r) => r.curso));
  }

  guardarCursoCatalogo(id: number | null, datos: Partial<FichaCurso>) {
    return (id
      ? this.http.put<{ curso: FichaCurso }>(`${this.api}/admin/cursos/${id}`, datos, this.sesion)
      : this.http.post<{ curso: FichaCurso }>(this.api + '/admin/cursos', datos, this.sesion)
    ).pipe(map((r) => r.curso));
  }

  archivarCurso(id: number, archivar: boolean) {
    return this.http.put<{ curso: FichaCurso }>(`${this.api}/admin/cursos/${id}/archivo`, { archivar }, this.sesion)
      .pipe(map((r) => r.curso));
  }

  // El Excel de matrículas y pagos que ya generaba "Reporte general".
  descargarReporteGeneral() {
    return this.http.get(this.api + '/matriculas-pagos-usuarios', { responseType: 'blob' }).pipe(
      map((archivo) => {
        saveAs(new Blob([archivo], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'PagosMatriculas.xlsx');
        return true;
      })
    );
  }
}
