import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';

@Component({
  selector: 'app-curso-lista',
  templateUrl: './curso-lista.component.html',
  styleUrls: ['./curso-lista.component.css']
})
export class CursoListaComponent {

  @Input() listaCursos:any
  @Input() listaCursosNuevos:any

  @Output() eliminar: EventEmitter<any> = new EventEmitter<any>();

  constructor(){
    
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  eliminarCurso(id:number){
    this.eliminar.emit(id)
  }

}
