import { Component } from '@angular/core';
import { AdminService, ResumenAdmin } from 'src/app/core/http/admin/admin.service';
import { Periodo, etiquetaPeriodo } from '../selector-periodo/selector-periodo.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  periodo?: Periodo;
  resumen?: ResumenAdmin;
  cargando = true;
  error = false;
  exportando = false;
  etiqueta = etiquetaPeriodo;

  constructor(private adminService: AdminService) { }

  cargar(periodo: Periodo) {
    this.periodo = periodo;
    this.cargando = true;
    this.error = false;
    this.adminService.getResumen(periodo.id).subscribe({
      next: (r) => {
        this.resumen = r;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }

  exportar() {
    this.exportando = true;
    this.adminService.descargarReporteGeneral().subscribe({
      next: () => (this.exportando = false),
      error: () => (this.exportando = false),
    });
  }

  get ultimosPagos() {
    return (this.resumen?.pagos ?? []).slice(0, 7);
  }
}
