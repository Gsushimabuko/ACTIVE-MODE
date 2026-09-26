import { Component } from '@angular/core';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursoPeriodo } from 'src/app/modules/shared/interfaces/Curso';
import { iconoCurso } from '../../icono-curso';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent {
  usuario: Usuario;
  periodos: Date[] = [];
  periodo?: Date;
  cursos: CursoPeriodo[] = [];
  cargando = true;
  iconoCurso = iconoCurso;

  constructor(usuarioService: ZUsuarioService, private cursoService: ZCursoService) {
    this.usuario = usuarioService.usuario;
    this.cursoService.getMatriculaActiva().subscribe({
      next: (meses: any[]) => {
        this.periodos = meses.map((m) => new Date(m.periodo_fecha));
        if (this.periodos.length) this.elegirPeriodo(this.periodos[0]);
        else this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  elegirPeriodo(periodo: Date) {
    this.periodo = periodo;
    this.cargando = true;
    this.cursoService.getCursos(periodo.getMonth(), periodo.getFullYear()).subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cargando = false;
      },
      error: () => {
        this.cursos = [];
        this.cargando = false;
      },
    });
  }

  consulta(curso: CursoPeriodo) {
    return { idCurso: curso.idCurso, mes: this.periodo!.getMonth(), ano: this.periodo!.getFullYear() };
  }
}
