import { Component, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ModoAccesoService } from 'src/app/core/acceso/modo-acceso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent implements OnDestroy {
  usuario: Usuario;
  menuMovil = false;
  menuUsuario = false;
  colapsado = false;

  navegacion = [
    { label: 'Cursos', icono: 'school', ruta: '/matricula/dashboard', exacto: true, soloCuenta: false },
    { label: 'Calendario', icono: 'calendar_month', ruta: '/matricula/calendario', exacto: true, soloCuenta: true },
    { label: 'Familia', icono: 'group', ruta: '/matricula/familia', exacto: false, soloCuenta: true },
    { label: 'Matrícula', icono: 'how_to_reg', ruta: '/matricula', exacto: true, soloCuenta: false },
  ];

  // Sin sesión solo se llega aquí en modo invitado (ValidarTokenGuard).
  invitado: boolean;

  private navegaciones: Subscription;

  constructor(private usuarioService: ZUsuarioService, private modo: ModoAccesoService, private router: Router) {
    this.usuario = this.usuarioService.usuario;
    this.invitado = !this.usuario.id;
    this.navegaciones = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.cerrarMenus());
  }

  get nombreCompleto(): string {
    return `${this.usuario?.nombre ?? ''} ${this.usuario?.apellidop ?? ''}`.trim();
  }

  get iniciales(): string {
    return ((this.usuario?.nombre?.[0] ?? '') + (this.usuario?.apellidop?.[0] ?? '')).toUpperCase();
  }

  @HostListener('document:keydown.escape')
  cerrarMenus() {
    this.menuMovil = false;
    this.menuUsuario = false;
  }

  cerrarSesion() {
    if (this.invitado) {
      this.modo.salirDeInvitado();
      this.router.navigateByUrl('/');
      return;
    }
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.navegaciones.unsubscribe();
  }
}
