import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UListasService {
  private API_URL = environment.API_URL + '/collection'; 
  


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
  
  getParentsByLastName(apellido: string): Observable<any[]> {
    const url = `${environment.API_URL}/parent/lastname?lastname=${apellido}`;
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
  
  createCollection(collectionData: any): Observable<any> {
    const url = `${this.API_URL}`;
    console.log("Enviando datos de la colección al backend:", collectionData);
    return this.http.post<any>(url, { collectionData });
  }
}