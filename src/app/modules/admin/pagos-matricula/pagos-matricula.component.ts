import { Component } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { AdminService, EstadoPagoAdmin, PagoAdmin } from 'src/app/core/http/admin/admin.service';
import { Periodo } from '../selector-periodo/selector-periodo.component';

@Component({
  selector: 'app-pagos-matricula',
  templateUrl: './pagos-matricula.component.html',
  styleUrls: ['./pagos-matricula.component.css']
})
export class PagosMatriculaComponent {
  pagos: PagoAdmin[] = [];
  filtro: EstadoPagoAdmin | 'todos' = 'todos';
  filtros: { valor: EstadoPagoAdmin | 'todos'; label: string }[] = [
    { valor: 'todos', label: 'Todos' },
    { valor: 'pagado', label: 'Pagados' },
    { valor: 'pendiente', label: 'Pendientes' },
  ];
  busqueda = '';
  cargando = true;
  error = false;
  exportando = false;
  sincronizando = false;
  periodoActual: Periodo | null = null;

  constructor(private adminService: AdminService) { }

  cargar(periodo: Periodo) {
    this.periodoActual = periodo;
    this.cargando = true;
    this.sincronizando = true;
    this.error = false;
    // Repara automáticamente pagos confirmados cuando el webhook original no
    // llegó; si Cobrana está temporalmente indisponible, igual mostramos la BD.
    this.adminService.reconciliarPagos(periodo.id).pipe(
      catchError(() => of(null)),
      switchMap(() => this.adminService.getResumen(periodo.id)),
    ).subscribe({
      next: (r) => {
        this.pagos = r.pagos;
        this.cargando = false;
        this.sincronizando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
        this.sincronizando = false;
      },
    });
  }

  actualizar() {
    if (this.periodoActual && !this.sincronizando) this.cargar(this.periodoActual);
  }

  get visibles(): PagoAdmin[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.pagos.filter((p) =>
      (this.filtro === 'todos' || p.estado === this.filtro) &&
      (!q || `${p.titular} ${p.ref ?? ''} ${p.correo ?? ''} ${p.detalle.map((d) => d.alumno + ' ' + d.curso).join(' ')}`.toLowerCase().includes(q))
    );
  }

  get totalVisible(): number {
    return this.visibles.reduce((t, p) => t + p.monto, 0);
  }

  exportar() {
    this.exportando = true;
    this.adminService.descargarReporteGeneral().subscribe({
      next: () => (this.exportando = false),
      error: () => (this.exportando = false),
    });
  }
}
