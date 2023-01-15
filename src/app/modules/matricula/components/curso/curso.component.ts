import { Component, Input } from '@angular/core';
import { Curso } from 'src/app/modules/shared/interfaces/Curso';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {

  @Input() curso!: Curso

  constructor(){

  }


}
