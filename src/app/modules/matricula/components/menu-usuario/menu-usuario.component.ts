import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-usuario',
  templateUrl: './menu-usuario.component.html',
  styleUrls: ['./menu-usuario.component.css']
})
export class MenuUsuarioComponent {
  @Input() invitado = false;
  @Input() nombre = '';
  @Input() correo = '';
  @Output() salir = new EventEmitter<void>();
}
