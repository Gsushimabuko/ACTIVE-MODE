import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

// Todas las rutas de colectas, alumnos y padres exigen sesión de administrador (header "jwt").
@Injectable({
  providedIn: 'root'
})
export class UListasService {
  private API_URL = environment.API_URL + '/collection';

  constructor(private http: HttpClient) {}

  private get sesion() {
    return { headers: new HttpHeaders().set('jwt', localStorage.getItem('jwt') || '') };
  }

  getListasDePago(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL, this.sesion);
  }

  getListaDePagoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`, this.sesion);
  }

  // Recordatorio a los padres con pagos pendientes de la lista.
  enviarReminderBulk(collectionId: number): Observable<{ message: string; pendientes: number; destinatarios: number }> {
    return this.http.post<any>(`${this.API_URL}/send-reminder-bulk`, { collectionId }, this.sesion);
  }

  // Alumnos = cuentas de la app (titulares y familiares). Busca en el nombre completo.
  buscarAlumnos(texto: string): Observable<{ id: number; nombre: string; detalle: string; correo: string }[]> {
    return this.http.get<any[]>(`${environment.API_URL}/alumno/buscar`, { ...this.sesion, params: { texto } });
  }

  getParentsByLastName(apellido: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/parent/lastname`, { ...this.sesion, params: { lastname: apellido } });
  }

  getGradesAndSections(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/student/grades-sections`, this.sesion);
  }

  getStudentsByClassroom(grade: string, section: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/student/classroom`, { ...this.sesion, params: { grade, section } });
  }

  createCollection(collectionData: any): Observable<{ message: string; sinPadres?: number; correosFallidos?: boolean }> {
    return this.http.post<any>(this.API_URL, { collectionData }, this.sesion);
  }

  updateListaDePago(updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${updatedData.PK_collection}`, updatedData, this.sesion);
  }

  getReport(id: any): Observable<Blob> {
    return this.http.get(`${environment.API_URL}/download/collection/${id}`, { ...this.sesion, responseType: 'blob' });
  }
}
