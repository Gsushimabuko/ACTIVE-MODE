import { Component } from '@angular/core';
import { ModoAccesoService } from 'src/app/core/acceso/modo-acceso.service';

@Component({
  selector: 'app-boton-invitado',
  template: `
    <div class="am-separador" aria-hidden="true"><span></span>O<span></span></div>
    <button type="button" class="invitado" (click)="entrar()">
      <span class="am-icon invitado__icono" aria-hidden="true">bolt</span>
      <span class="invitado__texto">
        <b>Matricúlate como invitado</b>
        <span>Sin crear cuenta. Solo curso, datos del alumno y pago.</span>
      </span>
      <span class="am-icon invitado__flecha" aria-hidden="true">arrow_forward</span>
    </button>
  `,
  styleUrls: ['./boton-invitado.component.css'],
})
export class BotonInvitadoComponent {
  constructor(private modo: ModoAccesoService) { }

  entrar() {
    this.modo.entrarComoInvitado();
    // Sin restos de otra sesión: se recarga la app ya en modo invitado.
    try {
      localStorage.removeItem('jwt');
      localStorage.removeItem('token');
    } catch { }
    window.location.href = '/matricula/dashboard';
  }
}
