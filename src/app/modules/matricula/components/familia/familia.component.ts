import { Component } from '@angular/core';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styleUrls: ['./familia.component.css']
})
export class FamiliaComponent {
  idTitular: number;
  familia: Usuario[] = [];
  busqueda = '';
  cargando = true;

  constructor(usuarioService: ZUsuarioService) {
    this.idTitular = usuarioService.usuario.id;
    usuarioService.getRelatives(this.idTitular).subscribe({
      next: (res) => {
        this.familia = res;
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  get filtrados(): Usuario[] {
    const q = this.busqueda.trim().toLowerCase();
    return q ? this.familia.filter((m) => `${m.nombre} ${m.apellidop} ${m.apellidom}`.toLowerCase().includes(q)) : this.familia;
  }

  iniciales(m: Usuario): string {
    return ((m.nombre?.[0] ?? '') + (m.apellidop?.[0] ?? '')).toUpperCase();
  }
}
