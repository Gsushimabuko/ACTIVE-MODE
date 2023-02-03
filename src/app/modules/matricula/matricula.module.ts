import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculaMainComponent } from './components/matricula-main/matricula-main.component';
import { MatriculaRoutingModule } from './matricula-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/core/material/material.module';
import { CursoComponent } from './components/curso/curso.component';
import { CursoDialogComponent } from './components/curso-dialog/curso-dialog.component';
import { FormularioMatriculaComponent } from './components/formulario-matricula/formulario-matricula.component';
import { CursoListaComponent } from './components/curso-lista/curso-lista.component';
import { CalendarModule } from '../calendar/calendar.module';
import { PasarelaComponent } from '../pasarela/pasarela.component';
import { PasarelaModule } from '../pasarela/pasarela.module';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { MisCursosComponent } from './components/mis-cursos/mis-cursos.component';



@NgModule({
  declarations: [
    MatriculaMainComponent,
    CursoComponent,
    CursoDialogComponent,
    FormularioMatriculaComponent,
    CursoListaComponent,
    DasboardComponent,
    MisCursosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatriculaRoutingModule,
    CalendarModule,
    PasarelaModule
  ]
})
export class MatriculaModule { }
