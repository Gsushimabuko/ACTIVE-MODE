import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UListasService } from 'src/app/core/http/u_listas/u-listas.service';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';

const MIN_LETRAS = 2;

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
    FK_parent: null as number | null, // ID del padre seleccionado
    cuota: 0,
    comision: 0
  };

  students: any[] = [];
  searchResults: any[] = [];
  parentSearchResults: any[] = []; // Resultados de búsqueda de padres
  sinAlumnos = false; // La búsqueda terminó y no encontró a nadie registrado
  sinPadres = false;
  searchSubject = new Subject<string>();
  parentSearchSubject = new Subject<string>(); // Subject para búsqueda de padres

  grades: any[] = [];
  sections: any[] = [];
  selectedGrade: any = null;
  selectedSection: any = null;

  error = '';
  enviando = false;

  constructor(
    private uListasService: UListasService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usuarioService: ZUsuarioService
  ) {}

  ngOnInit() {
    this.initializeSearch();
    this.initializeSearchParents();
    this.loadGradesAndSections();
  }

  // Cargar grados y secciones desde el servicio
  loadGradesAndSections() {
    this.uListasService.getGradesAndSections().subscribe({
      next: (data) => {
        this.grades = data;
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

  // --- Cuota y reparto (el backend repite el mismo reparto, así lo que se ve es lo que se cobra) ---

  // Lo que la persona escribió, o null si está vacío o fuera de rango.
  private get cuota(): number | null {
    const c = Number(this.formData.cuota);
    return this.formData.cuota !== null && Number.isFinite(c) && c > 0 ? c : null;
  }

  private get comisionPct(): number | null {
    const p = Number(this.formData.comision);
    return this.formData.comision !== null && Number.isFinite(p) && p >= 0 && p <= 100 ? p : null;
  }

  // Reparte en céntimos: el resto sobrante va de a un céntimo a los primeros alumnos.
  private repartir(cuota: number, comisionPct: number, n: number) {
    const a = Math.round(cuota * 100);
    const c = Math.round(Math.round(cuota * 100) * comisionPct / 100);
    return Array.from({ length: n }, (_, i) => {
      const base = Math.floor(a / n) + (i < a % n ? 1 : 0);
      const com = Math.floor(c / n) + (i < c % n ? 1 : 0);
      return { amount: base / 100, commission: com / 100, total: (base + com) / 100 };
    });
  }

  // Recalcula la cuota de cada alumno; se llama al cambiar la cuota, la comisión o la lista.
  calculateCuotas() {
    const cuota = this.cuota;
    const pct = this.comisionPct;
    const partes = cuota !== null && pct !== null && this.students.length
      ? this.repartir(cuota, pct, this.students.length)
      : null;

    this.students = this.students.map((student, i) => ({ ...student, cuota: partes ? partes[i].total : 0 }));
  }

  calculateTotalWithComision(): number {
    const cuota = this.cuota;
    const pct = this.comisionPct;
    if (cuota === null || pct === null) return 0;
    return this.repartir(cuota, pct, 1)[0].total;
  }

  // --- Alumnos: solo los que ya están registrados en la plataforma (vienen de la búsqueda) ---

  yaAgregado(student: any) {
    return this.students.some(s => s.id === student.id);
  }

  addStudentFromSearch(student: any) {
    if (this.yaAgregado(student)) return;

    this.students = [...this.students, { id: student.id, nombre: student.nombre, detalle: student.detalle, cuota: 0 }];
    this.error = '';
    this.calculateCuotas();
  }

  removeStudent(id: number) {
    this.students = this.students.filter(student => student.id !== id);
    this.calculateCuotas();
  }

  clearTable() {
    if (this.students.length < 2) { this.students = []; return; }

    this.dialog.open(ConfirmarDialogComponent, {
      width: '440px', panelClass: 'am-dialogo',
      data: {
        titulo: `¿Quitar a los ${this.students.length} alumnos de la lista?`,
        mensaje: 'Tendrás que volver a buscarlos o cargar el salón.',
        confirmar: 'Vaciar lista', peligro: true,
      },
    }).afterClosed().subscribe((ok) => { if (ok) this.students = []; });
  }

  // Devuelve el primer problema del formulario, o '' si se puede crear la lista.
  private validar(): string {
    if (!this.formData.nombre.trim()) return 'Escribe el nombre de la lista.';
    if (!this.formData.detalles.trim()) return 'Escribe los detalles de la lista.';
    if (this.formData.padre.trim() && !this.formData.FK_parent) return 'Elige al padre responsable de entre los resultados de la búsqueda o borra el campo.';
    if (this.cuota === null) return 'La cuota debe ser un monto mayor que 0.';
    if (this.comisionPct === null) return 'La comisión debe estar entre 0 y 100 %.';
    if (!this.students.length) return 'Agrega al menos un alumno a la lista.';
    if (this.cuota * 100 < this.students.length) return 'La cuota es muy pequeña para repartirla entre tantos alumnos.';
    return '';
  }

  onSubmit() {
    if (this.enviando) return;

    this.error = this.validar();
    if (this.error) return;

    const cuota = this.cuota as number;
    const pct = this.comisionPct as number;
    const partes = this.repartir(cuota, pct, this.students.length);
    const num_amount = Math.round(cuota * 100) / 100;
    const num_commission = Math.round(partes.reduce((s, p) => s + p.commission * 100, 0)) / 100;

    const collectionData = {
      var_name: this.formData.nombre.trim(),
      var_description: this.formData.detalles.trim(),
      num_amount, // Cuota total sin comisión
      num_commission, // Comisión total
      FK_parent: this.formData.FK_parent,
      var_admin_email: this.usuarioService.usuario.correo || null,
      students: this.students.map(student => ({ FK_usuario: student.id }))
    };

    this.enviando = true;
    this.uListasService.createCollection(collectionData).subscribe({
      next: (response) => {
        let mensaje = response.correosFallidos ? response.message : 'La lista de pago se creó y se avisó a los padres.';
        if (response.sinPadres) {
          mensaje += ` ${response.sinPadres} alumno(s) no tienen padres registrados y no recibieron correo.`;
        }
        this.snackBar.open(mensaje, 'Cerrar', { duration: 8000 });
        this.router.navigate(['/admin/edit-lista-pago']);
      },
      error: (error) => {
        this.enviando = false;
        this.error = error?.error?.message || 'Ocurrió un error al crear la lista de pago. Inténtalo nuevamente.';
      }
    });
  }

  // --- Búsquedas (se cancela la anterior si la persona sigue escribiendo) ---

  initializeSearch() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => term.length < MIN_LETRAS ? of(null) : this.uListasService.buscarAlumnos(term).pipe(
        catchError(() => { this.error = 'No se pudo buscar alumnos. Inténtalo nuevamente.'; return of(null); })
      ))
    ).subscribe((results) => {
      this.searchResults = results || [];
      this.sinAlumnos = results !== null && results.length === 0;
    });
  }

  initializeSearchParents() {
    this.parentSearchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => term.length < MIN_LETRAS ? of(null) : this.uListasService.getParentsByLastName(term).pipe(
        catchError(() => { this.error = 'No se pudo buscar padres. Inténtalo nuevamente.'; return of(null); })
      ))
    ).subscribe((results) => {
      this.parentSearchResults = results || [];
      this.sinPadres = results !== null && results.length === 0;
    });
  }

  handleSearchInput(event: Event) {
    this.searchSubject.next((event.target as HTMLInputElement).value.trim());
  }

  // Escribir en el campo invalida al padre elegido: hay que volver a elegirlo de la lista.
  handleParentSearchInput(event: Event) {
    this.formData.FK_parent = null;
    this.parentSearchSubject.next((event.target as HTMLInputElement).value.trim());
  }

  selectParent(parent: any) {
    this.formData.padre = `${parent.var_name} ${parent.var_lastname}`;
    this.formData.FK_parent = parent.PK_parent;
    this.parentSearchResults = [];
    this.sinPadres = false;
    this.error = '';
  }

  // En evaluación: el botón está oculto. Ojo: esto trae alumnos del padrón del colegio (u_student) y la
  // lista ahora se arma con cuentas de la app, así que sus ids no sirven tal cual.
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

        this.calculateCuotas(); // Recalcular cuotas
      },
      error: (error) => {
        console.error('Error al cargar estudiantes por grado y sección:', error);
        alert('Ocurrió un error al cargar los estudiantes. Por favor, intente nuevamente.');
      }
    });
  }
}
