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


@NgModule({
  declarations: [
    MatriculaMainComponent,
    CursoComponent,
    CursoDialogComponent,
    FormularioMatriculaComponent,
    CursoListaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatriculaRoutingModule,
  ]
})
export class MatriculaModule { }
