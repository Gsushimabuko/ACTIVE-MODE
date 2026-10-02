import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagenService {
  constructor(private http: HttpClient) { }

  subir(archivo: File) {
    const headers = new HttpHeaders({
      jwt: localStorage.getItem('jwt') || '',
      'Content-Type': archivo.type,
    });
    return this.http.post<{ ok: boolean; url: string }>(`${environment.API_URL}/imagenes`, archivo, { headers });
  }
}
