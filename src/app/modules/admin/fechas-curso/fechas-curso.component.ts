import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/core/http/admin/admin.service';
import { MESES } from '../selector-periodo/selector-periodo.component';

interface Celda { fecha: string; dia: number; permitido: boolean; inscritos: number }

const dos = (n: number) => String(n).padStart(2, '0');
const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

@Component({
  selector: 'app-fechas-curso',
  templateUrl: './fechas-curso.component.html',
  styleUrls: ['./fechas-curso.component.css']
})
export class FechasCursoComponent {
  idCursoPeriodo: number;
  nombreCurso: string;
  mes = 0;
  ano = 0;
  diasPermitidos: number[] = [];
  celdas: (Celda | null)[] = [];
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  originales = new Set<string>();
  elegidas = new Set<string>();
  cargando = true;
  guardando = false;
  errorCarga = '';
  error: { mensaje: string; detalle: string[] } | null = null;
  exito = '';

  constructor(route: ActivatedRoute, private adminService: AdminService) {
    this.idCursoPeriodo = Number(route.snapshot.paramMap.get('idCursoPeriodo'));
    this.nombreCurso = route.snapshot.queryParamMap.get('curso') ?? '';
    this.cargar();
  }

  get tituloPeriodo(): string {
    return this.mes ? `${MESES[this.mes - 1]} ${this.ano}` : '';
  }

  get nombresDiasPermitidos(): string {
    return this.diasPermitidos.map((d) => DIAS_SEMANA[d]).join(', ');
  }

  get agregadas(): string[] {
    return [...this.elegidas].filter((f) => !this.originales.has(f)).sort();
  }

  get quitadas(): string[] {
    return [...this.originales].filter((f) => !this.elegidas.has(f)).sort();
  }

  get hayCambios(): boolean {
    return this.agregadas.length > 0 || this.quitadas.length > 0;
  }

  cargar() {
    this.cargando = true;
    this.adminService.getFechasCurso(this.idCursoPeriodo).subscribe({
      next: (r) => {
        this.mes = r.mes;
        this.ano = r.ano;
        this.diasPermitidos = r.diasPermitidos;
        const inscritos = new Map<string, number>(r.fechas.map((f: any) => [f.fecha, f.inscritos]));
        this.originales = new Set(r.fechas.map((f: any) => f.fecha));
        this.elegidas = new Set(this.originales);
        this.armarMes(inscritos);
        this.cargando = false;
      },
      error: (e) => {
        this.errorCarga = e.error?.mensaje || 'No pudimos cargar las fechas del curso.';
        this.cargando = false;
      },
    });
  }

  // Grilla de lunes a domingo; null = casilla vacía fuera del mes.
  private armarMes(inscritos: Map<string, number>) {
    const dias = new Date(this.ano, this.mes, 0).getDate();
    const primero = (new Date(this.ano, this.mes - 1, 1).getDay() + 6) % 7;
    this.celdas = Array(primero).fill(null);
    for (let d = 1; d <= dias; d++) {
      const fecha = `${this.ano}-${dos(this.mes)}-${dos(d)}`;
      const diaSemana = new Date(this.ano, this.mes - 1, d).getDay();
      this.celdas.push({ fecha, dia: d, permitido: this.diasPermitidos.includes(diaSemana), inscritos: inscritos.get(fecha) ?? 0 });
    }
    while (this.celdas.length % 7) this.celdas.push(null);
  }

  // Una fecha con inscritos no se puede quitar (el backend también lo rechaza).
  bloqueada(c: Celda): boolean {
    return c.inscritos > 0 && this.originales.has(c.fecha);
  }

  alternar(c: Celda) {
    if (!c.permitido || this.bloqueada(c)) return;
    this.exito = '';
    this.error = null;
    if (this.elegidas.has(c.fecha)) this.elegidas.delete(c.fecha);
    else this.elegidas.add(c.fecha);
    this.elegidas = new Set(this.elegidas);
  }

  descartar() {
    this.elegidas = new Set(this.originales);
    this.error = null;
    this.exito = '';
  }

  guardar() {
    if (!this.hayCambios || this.guardando) return;
    this.guardando = true;
    this.error = null;
    this.adminService.setFechasCurso(this.idCursoPeriodo, [...this.elegidas].sort()).subscribe({
      next: (r) => {
        this.guardando = false;
        this.exito = `Fechas guardadas: ${r.fechasAgregadas.length} agregadas y ${r.fechasQuitadas.length} quitadas.`;
        this.cargar();
      },
      error: (e) => {
        this.guardando = false;
        this.error = { mensaje: e.error?.mensaje || 'No pudimos guardar las fechas.', detalle: e.error?.detalle || [] };
      },
    });
  }
}
