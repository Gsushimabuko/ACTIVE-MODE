import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { EditListaPagoDialogComponent } from './edit-lista-pago-dialog.component';

@Component({
  selector: 'app-edit-lista-pago',
  templateUrl: './edit-lista-pago.component.html',
  styleUrls: ['./edit-lista-pago.component.css']
})
export class EditListaPagoComponent implements OnInit {
  listasDePago: any[] = [];
  isLoading = false;
  errorMessage = '';
  pagina = 1;
  readonly porPagina = 10;

  constructor(private uListasService: UListasService, private dialog: MatDialog) { }

  ngOnInit() { this.loadListasDePago(); }

  loadListasDePago() {
    this.isLoading = true;
    this.errorMessage = '';
    this.uListasService.getListasDePago().subscribe({
      next: (listas) => {
        this.listasDePago = listas;
        this.pagina = 1;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Ocurrió un error al cargar las listas de pago.';
        this.isLoading = false;
      }
    });
  }

  get totalPaginas() { return Math.ceil(this.listasDePago.length / this.porPagina); }
  get paginas() { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }
  get listasPagina() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.listasDePago.slice(inicio, inicio + this.porPagina);
  }

  irAPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.pagina = pagina;
  }

  seleccionarLista(lista: any) {
    this.dialog.open(EditListaPagoDialogComponent, {
      data: { lista },
      width: '1120px',
      maxWidth: '96vw',
      maxHeight: '92vh',
      panelClass: 'lista-pago-dialogo',
      ariaLabel: `Detalle de ${lista.var_name}`,
    });
  }
}
