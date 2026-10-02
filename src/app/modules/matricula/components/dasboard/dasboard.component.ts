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
        const hoy = new Date();
        const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        // El catálogo público no debe abrir un período vencido aunque siga
        // activo en la configuración del BackOffice.
        this.periodos = meses
          // periodo_fecha llega como ISO UTC. Reconstruirlo en hora local evita
          // que en Perú el primer día de mes se interprete como el mes previo.
          .map((m) => {
            const fecha = new Date(m.periodo_fecha);
            return new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), 1);
          })
          .filter((periodo) => new Date(periodo.getFullYear(), periodo.getMonth(), 1) >= inicioMesActual)
          .sort((a, b) => a.getTime() - b.getTime());

        const periodoActual = this.periodos.find((periodo) =>
          periodo.getFullYear() === hoy.getFullYear() && periodo.getMonth() === hoy.getMonth()
        );
        if (periodoActual) this.elegirPeriodo(periodoActual);
        else if (this.periodos.length) this.elegirPeriodo(this.periodos[0]);
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
