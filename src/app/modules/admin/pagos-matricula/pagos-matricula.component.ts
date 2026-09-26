import { Component } from '@angular/core';
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

  constructor(private adminService: AdminService) { }

  cargar(periodo: Periodo) {
    this.cargando = true;
    this.error = false;
    this.adminService.getResumen(periodo.id).subscribe({
      next: (r) => {
        this.pagos = r.pagos;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
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
