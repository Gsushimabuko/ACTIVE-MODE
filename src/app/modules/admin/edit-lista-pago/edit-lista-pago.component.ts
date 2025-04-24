import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';

@Component({
  selector: 'app-edit-lista-pago',
  templateUrl: './edit-lista-pago.component.html',
  styleUrls: ['./edit-lista-pago.component.css']
})
export class EditListaPagoComponent implements OnInit {
  estudiantes: any[] = []; // Lista de estudiantes en la tabla
  selectedLista: any = null; // Detalle de la lista activa
  listasDePago: any[] = []; // Listas de pago disponibles
  isLoading: boolean = false; // Estado de carga
  errorMessage: string = ''; // Mensaje de error
  isEditing: boolean = false; // Estado de edición de la tabla

  constructor(private uListasService: UListasService, private location: Location) {}

  ngOnInit() {
    this.loadListasDePago(); // Cargar las listas de pago disponibles
  }

  // Cargar las listas de pago disponibles
  loadListasDePago() {
    this.isLoading = true;
    this.uListasService.getListasDePago().subscribe({
      next: (listas) => {
        this.listasDePago = listas;
        console.log('Listas de pago cargadas:', listas);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las listas de pago:', error);
        this.errorMessage = 'Ocurrió un error al cargar las listas de pago.';
        this.isLoading = false;
      }
    });
  }

  // Seleccionar una lista de pago
  seleccionarLista(lista: any) {
    if (!lista || !lista.PK_collection) {
      console.warn('La lista seleccionada no es válida:', lista);
      this.errorMessage = 'La lista seleccionada no es válida.';
      return;
    }

    this.selectedLista = lista;
    this.loadListaDePago();
  }

  // Cargar el detalle de la lista de pago activa
  loadListaDePago() {
    if (!this.selectedLista || !this.selectedLista.PK_collection) {
      console.warn('No hay una lista seleccionada o el ID de la lista es inválido.');
      this.errorMessage = 'Por favor, seleccione una lista válida.';
      return;
    }

    this.isLoading = true;
    this.uListasService.getListaDePagoPorId(this.selectedLista.PK_collection).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        this.selectedLista = data; // Actualizar el detalle de la lista seleccionada
        this.estudiantes = data.payments || []; // Asignar los pagos a la tabla de estudiantes
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el detalle de la lista de pago:', error);
        this.errorMessage = 'Ocurrió un error al cargar el detalle de la lista de pago.';
        this.isLoading = false;
      }
    });
  }

  // Alternar entre editar y guardar
  toggleEditTable() {
    if (this.isEditing) {
      // Guardar los datos actualizados
      const updatedData = {
        PK_collection: this.selectedLista.PK_collection,
        var_name: this.selectedLista.var_name,
        var_description: this.selectedLista.var_description,
        num_amount_collected: this.selectedLista.num_amount_collected,
        var_status: this.selectedLista.var_status,
        tsp_fec_creacion: this.selectedLista.tsp_fec_creacion,
        payments: this.estudiantes // Datos actualizados de la tabla
      };

      console.log('Datos actualizados:', updatedData);

      // Realizar la petición HTTP para actualizar los datos
      this.uListasService.updateListaDePago(updatedData).subscribe({
        next: () => {
          alert('La lista de pago se actualizó correctamente.');
        },
        error: (error) => {
          console.error('Error al actualizar la lista de pago:', error);
          alert('Ocurrió un error al actualizar la lista de pago. Por favor, intente nuevamente.');
        }
      });
    }

    this.isEditing = !this.isEditing; // Cambiar el estado de edición
  }

  // Enviar recordatorio masivo
  enviarRecordatorioMasivo() {
    if (!this.selectedLista || !this.selectedLista.PK_collection) {
      alert('Por favor, seleccione una lista de pago.');
      return;
    }

    this.isLoading = true;
    this.uListasService.enviarReminderBulk(this.selectedLista.PK_collection).subscribe({
      next: () => {
        alert('Recordatorio masivo enviado con éxito.');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al enviar el recordatorio masivo:', error);
        alert('Ocurrió un error al enviar el recordatorio masivo.');
        this.isLoading = false;
      }
    });
  }

  // Volver a la página anterior
  volver() {
    this.location.back();
  }

  // Formatear el monto de un pago
  formatMonto(pago: any): void {
    if (pago.num_total) {
      pago.num_total = parseFloat(pago.num_total.toFixed(2));
    }
  }
}



