import { Component } from '@angular/core';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';

@Component({
  selector: 'app-curso-lista',
  templateUrl: './curso-lista.component.html',
  styleUrls: ['./curso-lista.component.css']
})
export class CursoListaComponent {

  cursos!:CursoPeriodo[]

  constructor(){
    this.cursos = [
      {id: 1,
        nombre:"Voley",
        descripcion:"una descripcion corta",
        periodo:new Date,
        profesor:"Juan Carlos Tafur Roman",
        cupos:15},
    ]
  }

}
