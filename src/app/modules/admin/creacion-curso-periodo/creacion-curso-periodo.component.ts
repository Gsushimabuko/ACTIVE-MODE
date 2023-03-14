import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZDiaService } from 'src/app/core/http/z_dia/z-dia.service';
import { ZDiaGrupoService } from 'src/app/core/http/z_dia_grupo/z-dia-grupo.service';
import { ZNivelService } from 'src/app/core/http/z_nivel/z-nivel.service';
import { ZPeriodoService } from 'src/app/core/http/z_periodo/z-periodo.service';
import { ZTipoUsuarioService } from 'src/app/core/http/z_tipoUsuario/z-tipo-usuario.service';

@Component({
  selector: 'app-creacion-curso-periodo',
  templateUrl: './creacion-curso-periodo.component.html',
  styleUrls: ['./creacion-curso-periodo.component.css']
})
export class CreacionCursoPeriodoComponent {
  cursos: any = [];
  tipoUsuarios: any = [];
  dias: any = [];
  niveles: any = [];
  nivelElegido: any = '';

  nivelesElegidos: any[] = [];

  loading: boolean = true;

  formCursoPeriodo: FormGroup;
  formTarifa: FormGroup;
  constructor(private _periodoService: ZPeriodoService,
    private _cursoService: ZCursoService,
    private _tipoUsuarioService: ZTipoUsuarioService,
    private _diaService: ZDiaService,
    private _nivelService: ZNivelService,
    private _fb: FormBuilder) {
    this.loading = true;

    this.formCursoPeriodo = this._fb.group({
      cursoId: ['', Validators.required],
      profesor: ['', Validators.required],
      cupo: [0, [Validators.required, Validators.min(1), Validators.max(200)]],
    });

    this.formTarifa = this._fb.group({
      monto: [0, Validators.required],
      diaId: ['', Validators.required],
      tipoUsuarioId: ['', Validators.required],
    });

    this.getCursos();
    this.getTipoUsuario();
    this.getDia();
    this.getNiveles();
  }

  getCursos() {
    this._cursoService.getOnlyCursos().subscribe(data => {
      console.log(data);
      this.cursos = data.cursosActivos;
    });
  }

  getDia() {
    this._diaService.getDiasParam().subscribe(data => {
      console.log(data);
      this.dias = data;
    });
  }

  getTipoUsuario() {
    this._tipoUsuarioService.getTipoUsuariosParam().subscribe(data => {
      console.log(data);
      this.tipoUsuarios = data;
    });
  }

  getNiveles() {
    this._nivelService.getNivelesParam().subscribe(data => {
      console.log(data);
      this.niveles = data;
    });
  }

  agregarPropiedad() {
    if (this.nivelElegido == '') {
      return;
    }

    if (this.nivelesElegidos.includes(this.nivelElegido)) {
      return;
    }

    this.nivelesElegidos.push(this.nivelElegido);
  }

  eliminarPropiedad(i: number) {
    this.nivelesElegidos.splice(i, 1);
  }

  crearCursoPeriodo() {
    const periodoCursoData = {
      cursoId: this.formCursoPeriodo.get('cursoId')?.value,
      profesor: this.formCursoPeriodo.get('profesor')?.value,
      cupo: this.formCursoPeriodo.get('cupo')?.value,
      periodoId: this.formCursoPeriodo.get('cursoId')?.value, //PERIODO ID
    }

    const tarifaData = {
      monto: this.formTarifa.get('monto')?.value,
      diaId: this.formTarifa.get('diaId')?.value,
      tipoUsuarioId: this.formTarifa.get('tipoUsuarioId')?.value,
    }

    //Get dates and mili
    this.getHoras(this.nivelesElegidos[0].hora);

    const horarioData = {
      nivelIds: this.nivelesElegidos,
      fechaInicio: '',
      fechaFin: ''
    }
  }

  getHoras(hora: string) {
    const horas = [0, 0];

    const horaInicio = hora.substring(0, 3);
    const horaFin = hora.substring(6);

    if(horaInicio.includes('pm')) {
      const horaNum = horaInicio.replace(/^\D+/g, '');

      horas[0] += 12 + parseInt(horaNum);
    }
    else {
      const horaNum = horaInicio.replace(/^\D+/g, '');

      horas[0] += parseInt(horaNum);
    }

    if(horaFin.includes('pm')) {
      const horaNum = horaFin.replace(/^\D+/g, '');

      horas[1] += 12 + parseInt(horaNum);
    }
    else {
      const horaNum = horaFin.replace(/^\D+/g, '');

      horas[1] += parseInt(horaNum);
    }

    console.log(horas);
    return horas;
  }
}
