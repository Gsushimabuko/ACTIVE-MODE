import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router } from '@angular/router';
import { ZUsuarioService } from '../core/http/z_usuario/z-usuario.service';

// Portería (rol 3) solo usa Puerta y Entradas. Antes el menú las ocultaba, pero se podía entrar
// a cualquier pantalla del backoffice escribiendo la URL.
const PERMITIDAS_PORTERIA = ['menu-puerta', 'entradas'];

export const porteriaGuard: CanActivateChildFn = (ruta: ActivatedRouteSnapshot) => {
  const usuario = inject(ZUsuarioService).usuario;
  if (Number(usuario?.id_rol) !== 3) return true;
  return PERMITIDAS_PORTERIA.includes(ruta.routeConfig?.path ?? '') || inject(Router).parseUrl('/admin/menu-puerta');
};
