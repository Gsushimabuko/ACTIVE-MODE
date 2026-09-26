import { Component } from '@angular/core';
import { AdminService } from '../../../core/http/admin/admin.service';

@Component({
  selector: 'app-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.css']
})
export class ReporteGeneralComponent {
  descargando = false;
  error = false;

  constructor(private adminService: AdminService) {
    this.downloadFile();
  }

  downloadFile() {
    this.descargando = true;
    this.error = false;
    this.adminService.descargarReporteGeneral().subscribe({
      next: () => this.descargando = false,
      error: () => { this.descargando = false; this.error = true; }
    });
  }
}
