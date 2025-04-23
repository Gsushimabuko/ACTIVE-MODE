import { Component, OnInit } from '@angular/core';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { debounceTime, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

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
    FK_parent: null, // ID del padre seleccionado
    cuota: 0,
    comision: 0
  };

  students: any[] = [];
  filteredStudents: any[] = [];
  searchResults: any[] = [];
  parentSearchResults: any[] = []; // Resultados de búsqueda de padres
  searchTerm: string = '';
  parentSearchTerm: string = ''; // Término de búsqueda para padres
  searchSubject = new Subject<string>();
  parentSearchSubject = new Subject<string>(); // Subject para búsqueda de padres

  grades: any[] = [];
  sections: any[] = [];
  selectedGrade: any = null;
  selectedSection: any = null;

  constructor(
    private uListasService: UListasService,
    private location: Location,
    private usuarioService: ZUsuarioService
  ) {}

  ngOnInit() {
    this.initializeSearch();
    this.initializeSearchParents(); // Inicializar búsqueda de padres
    this.loadGradesAndSections();
    this.filteredStudents = [...this.students];
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
    // Validaciones
    if (!this.formData.nombre.trim()) {
      alert('El nombre de la lista no puede estar vacío.');
      return;
    }

    if (!this.formData.detalles.trim()) {
      alert('Los detalles de la lista no pueden estar vacíos.');
      return;
    }

    if (!this.formData.padre.trim()) {
      alert('Debe seleccionar un padre responsable.');
      return;
    }

    if (this.students.length === 0) {
      alert('Debe agregar al menos un estudiante a la lista.');
      return;
    }

    // Calcular valores globales
    const num_amount = parseFloat(this.formData.cuota.toFixed(2)); // Cuota base (sin comisión)
    const num_commission = parseFloat(((num_amount * this.formData.comision) / 100).toFixed(2)); // Comisión total
    const num_total = parseFloat((num_amount + num_commission).toFixed(2)); // Total (cuota + comisión)

    // Calcular valores individuales
    const num_individual_amount = parseFloat((num_amount / this.students.length).toFixed(2)); // Cuota base por estudiante
    const num_individual_commission = parseFloat((num_commission / this.students.length).toFixed(2)); // Comisión por estudiante
    const num_individual_total = parseFloat((num_individual_amount + num_individual_commission).toFixed(2)); // Total por estudiante

    // Preparar los datos para enviar
    const collectionData = {
      var_name: this.formData.nombre,
      var_description: this.formData.detalles,
      num_total: num_total, // Total (cuota + comisión)
      num_commission: num_commission, // Comisión total
      num_amount: num_amount, // Cuota base
      FK_parent: this.formData.FK_parent || null, // ID del padre (opcional)
      var_admin_email: 'shimabukogabriel@gmail.com', // Correo del administrador
      num_individual_amount: num_individual_amount, // Cuota base por estudiante
      num_individual_commission: num_individual_commission, // Comisión por estudiante
      num_individual_total: num_individual_total, // Total por estudiante
      students: this.students.map(student => ({ FK_student: student.id }))
    };

    console.log('Datos de la colección a enviar:', collectionData);

    // Enviar los datos al backend
    this.uListasService.createCollection(collectionData).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        alert('La lista de pago se creó exitosamente.');
        this.volver(); // Navegar de regreso después de la creación exitosa
      },
      error: (error) => {
        console.error('Error al crear la lista de pago:', error);
        alert('Ocurrió un error al crear la lista de pago. Por favor, intente nuevamente.');
      }
    });
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

  // Inicializar búsqueda de padres
  initializeSearchParents() {
    this.parentSearchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      if (searchTerm.trim() === '') {
        this.parentSearchResults = [];
        return;
      }

      this.uListasService.getParentsByLastName(searchTerm).subscribe({
        next: (results) => {
          this.parentSearchResults = results;
          console.log('Resultados de búsqueda de padres:', results);
        },
        error: (error) => {
          console.error('Error al buscar padres por apellido:', error);
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

  // Manejar entrada en el buscador de padres
  handleParentSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const searchTerm = inputElement.value.trim();
      this.onParentSearchInputChange(searchTerm);
    }
  }

  // Actualizar término de búsqueda de padres
  onParentSearchInputChange(searchTerm: string) {
    console.log('Término de búsqueda de padres:', searchTerm);
    this.parentSearchTerm = searchTerm;
    this.parentSearchSubject.next(searchTerm);
  }

  // Seleccionar un padre de los resultados de búsqueda
  selectParent(parent: any) {
    this.formData.padre = `${parent.var_name} ${parent.var_lastname}`;
    this.formData.FK_parent = parent.PK_parent; // Asignar el ID del padre al formulario
    this.parentSearchResults = []; // Limpiar resultados de búsqueda
    console.log('Padre seleccionado:', parent);
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

