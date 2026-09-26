import { Component, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

interface ItemMenu { label: string; icono: string; ruta: string; exacto?: boolean }

// Rol 2 = administración, rol 3 = portería (solo el control de acceso).
const BACKOFFICE: ItemMenu[] = [
  { label: 'Resumen', icono: 'dashboard', ruta: '/admin/dashboard' },
  { label: 'Alumnos', icono: 'groups', ruta: '/admin/alumnos' },
  { label: 'Catálogo de cursos', icono: 'menu_book', ruta: '/admin/catalogo' },
  { label: 'Cursos por periodo', icono: 'event_note', ruta: '/admin/creacion' },
  { label: 'Pagos de matrícula', icono: 'payments', ruta: '/admin/pagos-matricula' },
  { label: 'Matrícula extemporánea', icono: 'post_add', ruta: '/admin/matricula-extemporanea' },
  { label: 'Parámetros', icono: 'tune', ruta: '/admin/parametros' },
];
const OTROS: ItemMenu[] = [
  { label: 'Colectas', icono: 'volunteer_activism', ruta: '/admin/colectas' },
  { label: 'Generación de pagos', icono: 'request_quote', ruta: '/admin/pagos', exacto: true },
  { label: 'Entradas', icono: 'login', ruta: '/admin/entradas' },
  { label: 'Puerta', icono: 'door_front', ruta: '/admin/menu-puerta' },
];
const PORTERIA: ItemMenu[] = [
  { label: 'Puerta', icono: 'door_front', ruta: '/admin/menu-puerta' },
  { label: 'Entradas', icono: 'login', ruta: '/admin/entradas' },
];

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css']
})
export class AdminShellComponent implements OnDestroy {
  usuario: Usuario;
  esPorteria: boolean;
  grupos: { titulo: string; items: ItemMenu[] }[];
  menuMovil = false;
  private navegaciones: Subscription;

  constructor(usuarioService: ZUsuarioService, private router: Router) {
    this.usuario = usuarioService.usuario;
    this.esPorteria = this.usuario.id_rol == 3;
    this.grupos = this.esPorteria
      ? [{ titulo: 'Portería', items: PORTERIA }]
      : [{ titulo: 'Backoffice', items: BACKOFFICE }, { titulo: 'Colectas y puerta', items: OTROS }];
    this.navegaciones = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => (this.menuMovil = false));
  }

  get iniciales(): string {
    return ((this.usuario.nombre?.[0] ?? '') + (this.usuario.apellidop?.[0] ?? '')).toUpperCase();
  }

  @HostListener('document:keydown.escape')
  cerrarMenu() {
    this.menuMovil = false;
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigateByUrl('/login/admin');
  }

  ngOnDestroy() {
    this.navegaciones.unsubscribe();
  }
}
