import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pasos-matricula',
  templateUrl: './pasos-matricula.component.html',
  styleUrls: ['./pasos-matricula.component.css']
})
export class PasosMatriculaComponent {
  @Input() paso: number = 1;
  pasos = [{ n: 1, label: 'Cursos' }, { n: 2, label: 'Pago' }, { n: 3, label: 'Confirmación' }];
}
