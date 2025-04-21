import { HttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UListasService {
  private API_URL = environment.API_URL + '/collection'; 
  
  private allStudents = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', grado: '5to', seccion: 'A', padre: 'Carlos Pérez', madre: 'Ana López', correo: 'juan.perez@example.com', telefono: '123456789', cuota: 'Sin calcular' },
    { id: 2, nombre: 'María', apellido: 'Gómez', grado: '6to', seccion: 'B', padre: 'Luis Gómez', madre: 'Carmen Díaz', correo: 'maria.gomez@example.com', telefono: '987654321', cuota: 'Sin calcular' },
    { id: 3, nombre: 'María2', apellido: 'Gómez', grado: '6to', seccion: 'B', padre: 'Luis Gómez', madre: 'Carmen Díaz', correo: 'maria.gomez@example.com', telefono: '987654321', cuota: 'Sin calcular' },
    // Más datos de ejemplo...
  ];

  constructor(private http: HttpClient) {}

  // Método para obtener las listas de pago desde el backend
  getListasDePago(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Método para obtener el detalle de una lista de pago utilizando el ID http://localhost:5000/api/collection/1
  getListaDePagoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Método para enviar un mensaje masivo a los padres de familia collection/send-reminder-bulk (en el body envía el id de la lista de pago {"collectionId":1})
  enviarReminderBulk(collectionId: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/send-reminder-bulk`, { collectionId });
  }
  getStudentsByLastName(apellido: string): Observable<any[]> {
    const url = `${environment.API_URL}/student/lastname?lastname=${apellido}`;
    console.log("Realizando búsqueda por apellido en el backend:", url);
    return this.http.get<any[]>(url);
  }

  getGradesAndSections(): Observable<any[]> {
    const url = `${environment.API_URL}/student/grades-sections`;
    console.log("Obteniendo grados y secciones desde el backend:", url);
    return this.http.get<any[]>(url);
  } 

  getStudentsByClassroom(grade: string, section: string): Observable<any[]> {
    const url = `${environment.API_URL}/student/classroom?grade=${grade}&section=${section}`;
    console.log("Obteniendo estudiantes por grado y sección desde el backend:", url);
    return this.http.get<any[]>(url);
  }
  
}