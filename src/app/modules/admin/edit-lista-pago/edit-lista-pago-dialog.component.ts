import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';

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
  descargando = false;
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
  // Cómo estaba cada pago al empezar a editar: sirve para cancelar, para saber qué cambió y para no editar los ya cobrados.
  private original = new Map<number, { var_status: string; num_total: number }>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { lista: any },
    public dialogRef: MatDialogRef<EditListaPagoDialogComponent>,
    private uListasService: UListasService,
    private dialog: MatDialog,
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
        this.estudiantes = (data.payments || []).map((p: any) => ({
          ...p,
          contactos: [p.father, p.mother, ...p.parents].filter(Boolean), // todos los padres, sin importar su sexo
        }));
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

  // Un pago ya cobrado no se puede cambiar.
  editable(pago: any) { return this.isEditing && this.original.get(pago.PK_payment)?.var_status !== 'PAID'; }

  private get cambiados() {
    return this.estudiantes.filter((p) => {
      const o = this.original.get(p.PK_payment);
      return o && o.var_status !== 'PAID' && (o.var_status !== p.var_status || o.num_total !== Number(p.num_total));
    });
  }

  empezarEdicion() {
    this.original = new Map(this.estudiantes.map((p) => [p.PK_payment, { var_status: p.var_status, num_total: Number(p.num_total) }]));
    this.aviso = '';
    this.errorMessage = '';
    this.isEditing = true;
    this.dialogRef.disableClose = true; // Solo se sale con la X, que pregunta si hay cambios sin guardar
  }

  private terminarEdicion() {
    this.isEditing = false;
    this.dialogRef.disableClose = false;
  }

  cancelarEdicion() {
    this.estudiantes.forEach((p) => {
      const o = this.original.get(p.PK_payment);
      if (o) { p.var_status = o.var_status; p.num_total = o.num_total; }
    });
    this.errorMessage = '';
    this.terminarEdicion();
  }

  toggleEditTable() {
    if (!this.isEditing) { this.empezarEdicion(); return; }

    const cambios = this.cambiados;
    if (cambios.some((p) => !(Number(p.num_total) > 0))) {
      this.errorMessage = 'Cada monto debe ser mayor que 0.';
      return;
    }
    if (!cambios.length) { this.terminarEdicion(); return; }

    this.isLoading = true;
    this.errorMessage = '';
    this.aviso = '';
    this.uListasService.updateListaDePago({ ...this.selectedLista, payments: cambios }).subscribe({
      next: () => {
        this.terminarEdicion();
        this.aviso = 'Los montos y estados fueron actualizados.';
        this.cargarDetalle(); // Los contadores y el monto total cambian con los pagos
      },
      error: (e) => {
        this.isLoading = false;
        this.errorMessage = e?.error?.message || 'No se pudieron guardar los cambios. Inténtalo nuevamente.';
      },
    });
  }

  cerrar() {
    if (!this.isEditing || !this.cambiados.length) { this.dialogRef.close(); return; }

    this.dialog.open(ConfirmarDialogComponent, {
      width: '440px', panelClass: 'am-dialogo',
      data: { titulo: '¿Cerrar sin guardar?', mensaje: 'Los cambios de montos y estados que no guardaste se perderán.', confirmar: 'Cerrar sin guardar', peligro: true },
    }).afterClosed().subscribe((ok) => { if (ok) this.dialogRef.close(); });
  }

  enviarRecordatorioMasivo() {
    this.aviso = '';
    this.errorMessage = '';
    const pendientes = this.selectedLista.num_pending_count;
    if (!pendientes) { this.aviso = 'No hay pagos pendientes: nadie necesita recordatorio.'; return; }

    this.dialog.open(ConfirmarDialogComponent, {
      width: '440px', panelClass: 'am-dialogo',
      data: { titulo: '¿Enviar el recordatorio?', mensaje: `Se enviará un correo a los padres de los ${pendientes} pagos pendientes de esta lista.`, confirmar: 'Enviar recordatorio' },
    }).afterClosed().subscribe((ok) => { if (ok) this.enviarRecordatorio(); });
  }

  private enviarRecordatorio() {
    this.isLoading = true;
    this.uListasService.enviarReminderBulk(this.selectedLista.PK_collection).subscribe({
      next: (r) => {
        this.isLoading = false;
        if (r.destinatarios) this.aviso = `El recordatorio salió hacia ${r.destinatarios} correo(s) de ${r.pendientes} pago(s) pendientes.`;
        else this.errorMessage = r.message;
      },
      error: (e) => { this.isLoading = false; this.errorMessage = e?.error?.message || 'No se pudo enviar el recordatorio masivo.'; },
    });
  }

  downloadReport() {
    this.descargando = true;
    this.errorMessage = '';
    this.uListasService.getReport(this.selectedLista.PK_collection).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_${this.selectedLista.PK_collection}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargando = false;
      },
      error: () => { this.descargando = false; this.errorMessage = 'No se pudo descargar el Excel. Inténtalo nuevamente.'; },
    });
  }
}
