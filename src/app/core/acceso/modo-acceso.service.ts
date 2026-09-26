import { Injectable } from '@angular/core';

// Modo invitado: matricular sin cuenta. Solo es una preferencia del navegador,
// no da permisos: las pantallas de cuenta siguen pidiendo sesión válida.
@Injectable({ providedIn: 'root' })
export class ModoAccesoService {
  private readonly CLAVE = 'am-mode';

  get esInvitado(): boolean {
    try {
      return localStorage.getItem(this.CLAVE) === 'guest';
    } catch {
      return false;
    }
  }

  entrarComoInvitado() {
    try {
      localStorage.setItem(this.CLAVE, 'guest');
    } catch { }
  }

  salirDeInvitado() {
    try {
      localStorage.removeItem(this.CLAVE);
    } catch { }
  }

  // "Crear mi cuenta" después de pagar: el registro se completa con los datos que ya
  // escribió el invitado. El backend vincula esa cuenta a su matrícula si el correo coincide.
  guardarDatosParaRegistro(datos: Record<string, string>) {
    try {
      sessionStorage.setItem(this.CLAVE_DATOS, JSON.stringify(datos));
    } catch { }
  }

  tomarDatosParaRegistro(): Record<string, string> | null {
    try {
      const datos = sessionStorage.getItem(this.CLAVE_DATOS);
      sessionStorage.removeItem(this.CLAVE_DATOS);
      return datos ? JSON.parse(datos) : null;
    } catch {
      return null;
    }
  }

  private readonly CLAVE_DATOS = 'am-invitado';
}
