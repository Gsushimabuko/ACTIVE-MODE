import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {

  @Input() curso!: any

  

  constructor(private _fb: FormBuilder){



  }


}
