import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { debounceTime, Subject } from 'rxjs';

type StudentKey = 'id' | 'nombre' | 'apellido' | 'grado' | 'seccion' | 'padre' | 'madre' | 'correo' | 'telefono' | 'cuota';

@Component({
  selector: 'app-crear-lista-pago',
  templateUrl: './crear-lista-pago.component.html',
  styleUrls: ['./crear-lista-pago.component.css']
})
export class CrearListaPagoComponent implements OnInit {
  formData = {
    nombre: '',
    detalles: '',
    padre: '',
    cuota: 0,
    comision: 0
  };

  totalWithComision: number = 0;

  students = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', grado: '5to', seccion: 'A', padre: 'Carlos Pérez', madre: 'Ana López', correo: 'juan.perez@example.com', telefono: '123456789', cuota: 'Sin calcular' },
    { id: 2, nombre: 'María', apellido: 'Gómez', grado: '6to', seccion: 'B', padre: 'Luis Gómez', madre: 'Carmen Díaz', correo: 'maria.gomez@example.com', telefono: '987654321', cuota: 'Sin calcular' },
  ];

  filteredStudents = [...this.students];
  searchTerm: string = '';
  searchResults: any[] = [];
  searchSubject = new Subject<string>();

  currentPage = 1;
  itemsPerPage = 6;

  sortColumn: StudentKey = 'nombre';
  sortDirection: 'asc' | 'desc' = 'asc';

  grades = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  sections = ['A', 'B', 'C'];

  selectedGrade: string = '';
  selectedSection: string = '';

  constructor(
    private readonly location: Location, 
    private readonly uListasService: UListasService
  ) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.uListasService.searchStudentsByLastName(searchTerm).subscribe({
        next: (result) => {
          this.searchResults = result as any[];
        }
      });
    });
  }

  goBack() {
    this.location.back();
  }

  calculateTotal() {
    const cuota = this.formData.cuota || 0;
    const comision = this.formData.comision || 0;
    this.totalWithComision = cuota + (cuota * comision) / 100;
  }

  calculateCuotas() {
    if (this.totalWithComision === 0 || this.filteredStudents.length === 0) {
      alert('El monto total + comisión debe ser mayor a 0 y debe haber estudiantes en la lista.');
      return;
    }

    const cuotaPorEstudiante = (this.totalWithComision / this.filteredStudents.length).toFixed(2);
    this.students = this.students.map(student => ({
      ...student,
      cuota: cuotaPorEstudiante
    }));
    this.filterStudents();
  }

  addStudents() {
    if (!this.selectedGrade || !this.selectedSection) {
      alert('Por favor, seleccione un grado y una sección.');
      return;
    }

    const newStudents: any = this.uListasService.getStudentsByGradeAndSection(this.selectedGrade, this.selectedSection);

    const uniqueStudents = newStudents.filter((newStudent: any) => 
      !this.students.some(existingStudent => existingStudent.id === newStudent.id)
    );

    if (uniqueStudents.length === 0) {
      alert('No se encontraron nuevos estudiantes para agregar.');
      return;
    }

    this.students = [...this.students, ...uniqueStudents];
    this.filterStudents();
  }

  addStudentFromSearch(student: any) {
    if (this.students.some(existingStudent => existingStudent.id === student.id)) {
      alert('El estudiante ya está en la lista.');
      return;
    }
    this.students = [...this.students, student];
    this.filterStudents();
  }

  removeStudent(id: number) {
    this.students = this.students.filter(student => student.id !== id);
    this.filterStudents();
  }

  clearTable() {
    this.students = [];
    this.filterStudents();
  }

  filterStudents() {
    this.filteredStudents = this.students.filter(student =>
      student.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  onSearchInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement?.value || '';

    if (searchTerm.trim() === '') {
      this.searchResults = []; // Limpia los resultados si el input está vacío
      return;
    }

    this.searchSubject.next(searchTerm);
  }

  get paginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredStudents.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Array(Math.ceil(this.filteredStudents.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  sortTable(column: StudentKey) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredStudents.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onSubmit() {
    if (this.students.some(student => student.cuota === 'Sin calcular')) {
      alert('Todos los estudiantes deben tener una cuota asignada.');
      return;
    }

    const listaPago = {
      ...this.formData,
      estudiantes: this.students
    };

    console.log('Datos enviados:', listaPago);
    alert('Lista de pago creada exitosamente.');
  }
}

