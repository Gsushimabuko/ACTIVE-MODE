import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ModoAccesoService } from '../core/acceso/modo-acceso.service';
import { ZUsuarioService } from '../core/http/z_usuario/z-usuario.service';

// Entrada a /matricula: con sesión válida, o en modo invitado (las pantallas de
// cuenta tienen además su propio guard, CuentaGuard).
@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  constructor(private usuarioService: ZUsuarioService,
    private modo: ModoAccesoService,
    private router: Router) { }

  private permitir(): Observable<boolean | UrlTree> {
    // Sin token guardado no hay sesión que validar: se evita un 401 por cada navegación del invitado.
    let hayToken = false;
    try {
      hayToken = !!localStorage.getItem('jwt');
    } catch { }
    if (!hayToken) return of(this.modo.esInvitado || this.router.parseUrl('/login'));

    return this.usuarioService.validarToken().pipe(
      map((valido) => valido || this.modo.esInvitado || this.router.parseUrl('/login'))
    );
  }

  canActivate() {
    return this.permitir();
  }

  canLoad() {
    return this.permitir();
  }
}
