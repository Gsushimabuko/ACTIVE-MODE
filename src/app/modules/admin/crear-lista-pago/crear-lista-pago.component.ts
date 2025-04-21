import { Component, OnInit } from '@angular/core';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { debounceTime, Subject } from 'rxjs';
import { Location } from '@angular/common';

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

  students: any[] = [];
  filteredStudents: any[] = [];
  searchResults: any[] = [];
  searchTerm: string = '';
  searchSubject = new Subject<string>();

  grades: any[] = []; // Lista de grados
  sections: any[] = []; // Lista de secciones asociadas al grado seleccionado
  selectedGrade: any = null; // Grado seleccionado
  selectedSection: any = null; // Sección seleccionada

  constructor(private uListasService: UListasService, private location: Location) {}

  ngOnInit() {
    this.initializeSearch();
    this.loadGradesAndSections(); // Cargar grados y secciones al iniciar
    this.filteredStudents = [...this.students]; // Inicializar la tabla con todos los estudiantes
  }

  // Cargar grados y secciones desde el servicio
  loadGradesAndSections() {
    this.uListasService.getGradesAndSections().subscribe({
      next: (data) => {
        this.grades = data;
        console.log('Grados y secciones cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar grados y secciones:', error);
      }
    });
  }

  onGradeChange() {
    const grade = this.grades.find(g => g.PK_grade === +this.selectedGrade); // Convertir a número si es necesario
    this.sections = grade ? grade.sections : [];
    this.selectedSection = null; // Reiniciar la selección de sección
  }

  // Métodos principales
  addStudentFromSearch(student: any) {
    console.log('Estudiante seleccionado:', student);

    const mappedStudent = {
      id: student.PK_student,
      nombre: student.var_name,
      apellido: student.var_lastname,
      grado: student.section.grade.var_name,
      seccion: student.section.var_name,
      cuota: 0 // Inicializar la cuota en 0
    };

    if (this.students.some(existingStudent => existingStudent.id === mappedStudent.id)) {
      alert('El estudiante ya está en la lista.');
      return;
    }

    this.students = [...this.students, mappedStudent];
    this.filteredStudents = [...this.students]; // Actualizar la tabla con todos los estudiantes
    this.calculateCuotas();
  }

  removeStudent(id: number) {
    this.students = this.students.filter(student => student.id !== id);
    this.filteredStudents = [...this.students]; // Actualizar la tabla con todos los estudiantes
    this.calculateCuotas();
  }

  clearTable() {
    this.students = [];
    this.filteredStudents = [];
  }

  calculateCuotas() {
    const totalCuota = this.formData.cuota;
    const comision = this.formData.comision;

    const cuotaConComision = totalCuota + (totalCuota * comision) / 100;

    const cuotaPorEstudiante = this.students.length > 0
      ? cuotaConComision / this.students.length
      : 0;

    this.students = this.students.map(student => ({
      ...student,
      cuota: cuotaPorEstudiante
    }));

    this.filteredStudents = [...this.students]; // Actualizar la tabla con las cuotas calculadas
  }

  calculateTotalWithComision(): number {
    const totalCuota = this.formData.cuota;
    const comision = this.formData.comision;
    return totalCuota + (totalCuota * comision) / 100;
  }

  onSubmit() {
    this.calculateCuotas();
    console.log('Formulario enviado:', this.formData, this.students);
    // Aquí puedes agregar la lógica para enviar los datos al backend
  }

  // Métodos relacionados con la barra de búsqueda
  initializeSearch() {
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      if (searchTerm.trim() === '') {
        this.searchResults = [];
        return;
      }

      this.uListasService.getStudentsByLastName(searchTerm).subscribe({
        next: (results) => {
          this.searchResults = results;
          console.log('Resultados de búsqueda:', results);
        },
        error: (error) => {
          console.error('Error al buscar estudiantes por apellido:', error);
        }
      });
    });
  }

  handleSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const searchTerm = inputElement.value.trim();
      this.onSearchInputChange(searchTerm);
    }
  }

  onSearchInputChange(searchTerm: string) {
    console.log('Término de búsqueda:', searchTerm);
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  loadStudentsByClassroom() {
    if (!this.selectedGrade || !this.selectedSection) {
      alert('Por favor, seleccione un grado y una sección.');
      return;
    }

    const grade = this.grades.find(g => g.PK_grade === +this.selectedGrade)?.var_name;
    const section = this.sections.find(s => s.PK_section === +this.selectedSection)?.var_name;

    if (!grade || !section) {
      alert('Grado o sección no válidos.');
      return;
    }

    this.uListasService.getStudentsByClassroom(grade, section).subscribe({
      next: (students) => {
        console.log('Estudiantes cargados:', students);

        // Mapear los estudiantes obtenidos al formato esperado
        const mappedStudents = students.map(student => ({
          id: student.PK_student,
          nombre: student.var_name,
          apellido: student.var_lastname,
          grado: grade,
          seccion: section,
          cuota: 0 // Inicializar la cuota en 0
        }));

        // Evitar duplicados al agregar estudiantes
        mappedStudents.forEach(student => {
          if (!this.students.some(existingStudent => existingStudent.id === student.id)) {
            this.students.push(student);
          }
        });

        this.filteredStudents = [...this.students]; // Actualizar la tabla con todos los estudiantes
        this.calculateCuotas(); // Recalcular cuotas
      },
      error: (error) => {
        console.error('Error al cargar estudiantes por grado y sección:', error);
        alert('Ocurrió un error al cargar los estudiantes. Por favor, intente nuevamente.');
      }
    });
  }

  volver() {
    this.location.back();
  }
}

