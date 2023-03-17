import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  diasSemana: any[] = [{
    id: 1,
    dia: 'Lunes',
    day: 'Monday',
  }, {
    id: 2,
    dia: 'Martes',
    day: 'Tuesday',
  }, {
    id: 3,
    dia: 'Miércoles',
    day: 'Wednesday',
  }, {
    id: 4,
    dia: 'Jueves',
    day: 'Thrusday',
  }, {
    id: 5,
    dia: 'Viernes',
    day: 'Friday',
  }, {
    id: 6,
    dia: 'Sábado',
    day: 'Saturday',
  }]

  noNivelError: boolean = false;
  noTarifaError: boolean = false;

  mes: number = -1;
  ano: number = -1;

  nivelesElegidos: any[] = [];

  periodoId: number;

  loading: boolean = true;

  formCursoPeriodo: FormGroup;
  formTarifa: FormGroup;
  formDias: FormGroup;

  tarifasElegidas: any[] = [];

  constructor(private _periodoService: ZPeriodoService,
    private _cursoService: ZCursoService,
    private _tipoUsuarioService: ZTipoUsuarioService,
    private _diaService: ZDiaService,
    private _nivelService: ZNivelService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.loading = true;

    this.periodoId = parseInt(_route.snapshot.paramMap.get('periodoId')!!);

    this.formCursoPeriodo = this._fb.group({
      cursoId: ['', Validators.required],
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

    this.getCursos();
    this.getTipoUsuario();
    this.getDia();
    this.getNiveles();
    this.getPeriodo();
  }

  getPeriodo() {
    this._periodoService.getPeriodoParam(this.periodoId).subscribe(data => {
      console.log(data);
      this.mes = data.mes;
      this.ano = data.ano;
    });
  }

  getCursos() {
    this._cursoService.getOnlyCursos().subscribe(data => {
      console.log(data);
      this.cursos = data.cursosActivos;
    });
  }

  getDia() {
    this._diaService.getDiasParam().subscribe(data => {
      //console.log(data);
      this.dias = data;

      //this.generateDiaTipoUsuario();
    });
  }

  getTipoUsuario() {
    this._tipoUsuarioService.getTipoUsuariosParam().subscribe(data => {
      //console.log(data);
      this.tipoUsuarios = data;

      //this.generateDiaTipoUsuario();
    });
  }

  generateDiaTipoUsuario() {
    if (this.dias.length <= 0) {
      return;
    }

    if (this.tipoUsuarios.length <= 0) {
      return;
    }

    for(let dia of this.dias) {
      for (let tipoUsuario of this.tipoUsuarios) {
        const tarifaData = {
          diaId: dia.id,
          dia: dia.dias_semana,
          tipoUsuarioId: tipoUsuario.id,
          tipoUsuario: tipoUsuario.nombre,
          monto: 200,
        }

        this.tarifasElegidas.push(tarifaData);
      }
    }

    console.log(this.tarifasElegidas)
  }

  generarTarifas() {
    const dias = this.formTarifa.get('diaId')?.value;
    const tipoUsuarios = this.formTarifa.get('tipoUsuarioId')?.value;

    if (dias.length == 0) {
      return;
    }
    if (tipoUsuarios.length == 0) {
      return;
    }

    this.noTarifaError = false;
    this.tarifasElegidas = [];

    for(let dia of dias) {
      for (let tipo of tipoUsuarios) {
        this.tarifasElegidas.push({
          diaId: dia.id,
          dia: dia.nombre,
          tipoUsuarioId: tipo.id,
          tipoUsuario: tipo.nombre,
          monto: 200,
        });
      }
    }

    //console.log(this.tarifasElegidas);
  }

  getNiveles() {
    this._nivelService.getNivelesParam().subscribe(data => {
      //console.log(data);
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

    this.noNivelError = false;
    this.nivelesElegidos.push(this.nivelElegido);
  }

  eliminarPropiedad(i: number) {
    this.nivelesElegidos.splice(i, 1);
  }

  crearCursoPeriodo() {
    if (!this.formCursoPeriodo.valid) {
      this.formCursoPeriodo.markAllAsTouched();
      return;
    }

    if (this.tarifasElegidas.length == 0) {
      this.noTarifaError = true;
      return;
    }

    this.noTarifaError = false;

    if (!this.formDias.valid) {
      this.formDias.markAllAsTouched();
      return;
    }
    
    if (this.nivelesElegidos.length == 0) {
      this.noNivelError = true;
      return;
    }

    this.noNivelError = false;

    let diasMax = 0;

    for (let dia of this.formTarifa.get('diaId')?.value) {
      let num = parseInt(dia.nombre.replace(/^\D+/g, ''));

      if (num > diasMax) {
        diasMax = num;
      }
    }

    if (!(this.formDias.get('dias')?.value.length == diasMax)) {
      alert('El número de dias a la semana (' + this.formDias.get('dias')?.value.length + ') no corresponde con las tarifas seleccionadas (' + diasMax + ' días a la semana)');
      return;
    }

    let dias = "";

    for (let dia of this.formDias.get('dias')?.value) {
      if (dias == "") {
        dias += dia.id
      }
      else {
        dias += "," + dia.id
      }
    }

    const cursoPeriodoData = {
      cursoId: this.formCursoPeriodo.get('cursoId')?.value,
      profesor: this.formCursoPeriodo.get('profesor')?.value,
      cupo: this.formCursoPeriodo.get('cupo')?.value,
      periodoId: this.periodoId,
      mes: this.mes,
      ano: this.ano,
      dias: dias
    }
    
    this._cursoService.createCursoPeriodo(cursoPeriodoData, this.tarifasElegidas, this.nivelesElegidos).subscribe(data => {
      //console.log(data);

      this._router.navigate(['admin/creacion'], {
        queryParams: {
          mes: this.mes,
          ano: this.ano
        }
      });
    })
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
