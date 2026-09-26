import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZCursoService } from 'src/app/core/http/z_curso/z-curso.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursoMatriculado } from 'src/app/modules/shared/interfaces/Curso';
import { iconoCurso } from '../../icono-curso';

@Component({
  selector: 'app-familiar-detalle',
  templateUrl: './familiar-detalle.component.html',
  styleUrls: ['./familiar-detalle.component.css']
})
export class FamiliarDetalleComponent {
  miembro?: Usuario;
  esTitular = false;
  mes = new Date();
  cursos: CursoMatriculado[] = [];
  cargando = true;
  iconoCurso = iconoCurso;

  constructor(route: ActivatedRoute, usuarioService: ZUsuarioService, cursoService: ZCursoService) {
    const id = Number(route.snapshot.paramMap.get('id'));
    const idTitular = usuarioService.usuario.id;
    this.esTitular = id === idTitular;

    // /familiares solo devuelve la familia del titular: así además nadie ve la ficha de otra cuenta.
    usuarioService.getRelatives(idTitular).subscribe({
      next: (familia) => {
        this.miembro = familia.find((m) => m.id === id);
        if (!this.miembro) {
          this.cargando = false;
          return;
        }
        cursoService.getCursosHorariosMatriculados(id, this.mes.getMonth(), this.mes.getFullYear()).subscribe({
          next: (cursos) => {
            this.cursos = cursos;
            this.cargando = false;
          },
          error: () => (this.cargando = false),
        });
      },
      error: () => (this.cargando = false),
    });
  }

  get iniciales(): string {
    return ((this.miembro?.nombre?.[0] ?? '') + (this.miembro?.apellidop?.[0] ?? '')).toUpperCase();
  }
}
