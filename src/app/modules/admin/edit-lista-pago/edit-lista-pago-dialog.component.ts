import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';

@Component({
  selector: 'app-edit-lista-pago-dialog',
  templateUrl: './edit-lista-pago-dialog.component.html',
  styleUrls: ['./edit-lista-pago-dialog.component.css'],
})
export class EditListaPagoDialogComponent implements OnInit {
  selectedLista: any;
  estudiantes: any[] = [];
  isLoading = true;
  isEditing = false;
  errorMessage = '';
  aviso = '';
  filtroEstado = '';
  pagina = 1;
  readonly porPagina = 10;
  readonly link = environment.API_URL_FRONT + '/pagos/';
  readonly filtros = [
    { valor: '', texto: 'Todos' },
    { valor: 'PENDING', texto: 'Pendientes' },
    { valor: 'PAID', texto: 'Pagados' },
    { valor: 'CANCELLED', texto: 'Cancelados' },
  ];
  private readonly estados: Record<string, { texto: string; icono: string; clase: string }> = {
    PENDING: { texto: 'Pendiente', icono: 'schedule', clase: 'am-estado--pendiente' },
    PAID: { texto: 'Pagado', icono: 'check_circle', clase: 'am-estado--ok' },
    CANCELLED: { texto: 'Cancelado', icono: 'cancel', clase: 'am-estado--error' },
    ACTIVE: { texto: 'Activo', icono: 'link', clase: 'am-estado--neutro' },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { lista: any },
    public dialogRef: MatDialogRef<EditListaPagoDialogComponent>,
    private uListasService: UListasService,
  ) {
    this.selectedLista = data.lista;
  }

  ngOnInit() { this.cargarDetalle(); }

  cargarDetalle() {
    this.isLoading = true;
    this.errorMessage = '';
    this.uListasService.getListaDePagoPorId(this.selectedLista.PK_collection).subscribe({
      next: (data) => {
        this.selectedLista = data;
        this.estudiantes = data.payments || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el detalle de esta lista.';
        this.isLoading = false;
      },
    });
  }

  get estudiantesFiltrados() {
    return this.filtroEstado ? this.estudiantes.filter((p) => p.var_status === this.filtroEstado) : this.estudiantes;
  }
  get totalPaginas() { return Math.ceil(this.estudiantesFiltrados.length / this.porPagina); }
  get paginas() { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }
  get pagosPagina() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.estudiantesFiltrados.slice(inicio, inicio + this.porPagina);
  }

  cambiarFiltro(estado: string) { this.filtroEstado = estado; this.pagina = 1; }
  irAPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.pagina = pagina;
  }
  estado(status: string) { return this.estados[status] || { texto: status, icono: 'help', clase: 'am-estado--neutro' }; }
  formatMonto(pago: any) { if (pago.num_total !== null && pago.num_total !== undefined) pago.num_total = Number(Number(pago.num_total).toFixed(2)); }

  toggleEditTable() {
    if (!this.isEditing) { this.isEditing = true; return; }
    this.isLoading = true;
    this.errorMessage = '';
    this.aviso = '';
    this.uListasService.updateListaDePago({ ...this.selectedLista, payments: this.estudiantes }).subscribe({
      next: () => {
        this.isEditing = false;
        this.isLoading = false;
        this.aviso = 'Los montos y estados fueron actualizados.';
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudieron guardar los cambios. Inténtalo nuevamente.';
      },
    });
  }

  enviarRecordatorioMasivo() {
    this.isLoading = true;
    this.errorMessage = '';
    this.aviso = '';
    this.uListasService.enviarReminderBulk(this.selectedLista.PK_collection).subscribe({
      next: () => { this.isLoading = false; this.aviso = 'El recordatorio masivo fue enviado.'; },
      error: () => { this.isLoading = false; this.errorMessage = 'No se pudo enviar el recordatorio masivo.'; },
    });
  }

  downloadReport() {
    this.uListasService.getReport(this.selectedLista.PK_collection).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_${this.selectedLista.PK_collection}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
