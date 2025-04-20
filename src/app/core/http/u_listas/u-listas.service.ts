import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UListasService {
  private allStudents = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', grado: '5to', seccion: 'A', padre: 'Carlos Pérez', madre: 'Ana López', correo: 'juan.perez@example.com', telefono: '123456789', cuota: 'Sin calcular' },
    { id: 2, nombre: 'María', apellido: 'Gómez', grado: '6to', seccion: 'B', padre: 'Luis Gómez', madre: 'Carmen Díaz', correo: 'maria.gomez@example.com', telefono: '987654321', cuota: 'Sin calcular' },
    { id: 3, nombre: 'María2', apellido: 'Gómez', grado: '6to', seccion: 'B', padre: 'Luis Gómez', madre: 'Carmen Díaz', correo: 'maria.gomez@example.com', telefono: '987654321', cuota: 'Sin calcular' },
    // Más datos de ejemplo...
  ];
  private readonly API_URL = environment.API_URL + '/student'

  constructor(private readonly _http: HttpClient) { }

  getStudentsByGradeAndSection(grado: string, seccion: string) {
    console.log("TRAYENDO A TODOS LOS ALUMNOS DE UNA SECCIÓN Y GRADO", this.allStudents)
    return this.allStudents.filter(student => student.grado === grado && student.seccion === seccion);
    return this._http.get(`${this.API_URL}/classroom?grade=${grado}&section=${seccion}`);
  }

  searchStudentsByLastName(apellido: string) {
    return this._http.get(`${this.API_URL}/lastname?lastname=${apellido}`);
  }
}