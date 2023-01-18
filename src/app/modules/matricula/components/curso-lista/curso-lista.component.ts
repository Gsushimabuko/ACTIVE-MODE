import { Component } from '@angular/core';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';

@Component({
  selector: 'app-curso-lista',
  templateUrl: './curso-lista.component.html',
  styleUrls: ['./curso-lista.component.css']
})
export class CursoListaComponent {

  cursos!: any

  constructor(){
    
  }

}
