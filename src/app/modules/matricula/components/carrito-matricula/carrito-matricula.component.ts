import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carrito-matricula',
  templateUrl: './carrito-matricula.component.html',
  styleUrls: ['./carrito-matricula.component.css']
})
export class CarritoMatriculaComponent {
  @Input() cursos: any[] = [];
  @Input() alumno: string = '';
  @Input() periodo: Date | null = null;
  @Input() total: number = 0;
  @Output() quitar = new EventEmitter<number>();
  @Output() continuar = new EventEmitter<void>();
}
