import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';

@Component({
  selector: 'app-editar-curso-periodo',
  templateUrl: './editar-curso-periodo.component.html',
  styleUrls: ['./editar-curso-periodo.component.css']
})
export class EditarCursoPeriodoComponent {
  formCursoPeriodo: FormGroup;
  formTarifa: FormGroup;
  formDias: FormGroup;
  
  nivelesElegidos: any[] = [];
  tarifasElegidas: any[] = [];

  constructor(private _fb: FormBuilder,
    public dialogRef: MatDialogRef<EditarCursoPeriodoComponent>,
    private _cursoService: ZCursoService,
    @Inject(MAT_DIALOG_DATA) public data:any) {

    console.log(data);

    this.formCursoPeriodo = this._fb.group({
      profesor: ['', Validators.required],
      cupo: [0, [Validators.required, Validators.min(1), Validators.max(200)]],
    });

    this.formTarifa = this._fb.group({
      diaId: ['', Validators.required],
      tipoUsuarioId: ['', Validators.required],
    });

    this.formDias = this._fb.group({
      dias: [[], Validators.required]
    });
  }
}
