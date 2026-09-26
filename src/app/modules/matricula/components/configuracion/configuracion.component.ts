import { Component } from '@angular/core';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {
  usuario: Usuario;
  pestana: 'perfil' | 'seguridad' = 'perfil';
  envio: 'listo' | 'enviando' | 'enviado' | 'error' = 'listo';

  constructor(private usuarioService: ZUsuarioService) {
    this.usuario = usuarioService.usuario;
  }

  get iniciales(): string {
    return ((this.usuario.nombre?.[0] ?? '') + (this.usuario.apellidop?.[0] ?? '')).toUpperCase();
  }

  get datos() {
    const u = this.usuario;
    return [
      { label: 'Nombres', valor: u.nombre },
      { label: 'Apellidos', valor: `${u.apellidop ?? ''} ${u.apellidom ?? ''}`.trim() },
      { label: 'Correo electrónico', valor: u.correo },
      { label: 'Teléfono', valor: u.telefono },
      { label: 'DNI / CE', valor: u.dni },
      { label: 'Dirección', valor: u.direccion },
    ];
  }

  enviarEnlace() {
    this.envio = 'enviando';
    this.usuarioService.enviarCorreoContrasena({ correo: this.usuario.correo }).subscribe({
      next: () => (this.envio = 'enviado'),
      error: () => (this.envio = 'error'),
    });
  }
}
