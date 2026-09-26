import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ZUsuarioService } from '../core/http/z_usuario/z-usuario.service';

// Pantallas que solo existen con cuenta (Calendario, Familia, Configuración).
// Corre después de ValidarTokenGuard, que ya cargó al usuario si hay sesión.
@Injectable({ providedIn: 'root' })
export class CuentaGuard implements CanActivate {
  constructor(private usuarioService: ZUsuarioService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (this.usuarioService.usuario.id) return true;
    return this.router.createUrlTree(['/matricula/requiere-cuenta'], { queryParams: { seccion: route.data['seccion'] } });
  }
}
