import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosParamComponent } from './cursos/cursos-param.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DiaComponent } from './dia/dia.component';
import { TipoUsuariosComponent } from './tipo-usuarios/tipo-usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { NivelesComponent } from './niveles/niveles.component';
import { DiaGrupoComponent } from './dia-grupo/dia-grupo.component';
import { CursosDialogComponent } from './cursos/cursos-dialog/cursos-dialog.component';
import { DiaDialogComponent } from './dia/dia-dialog/dia-dialog.component';
import { NivelesDialogComponent } from './niveles/niveles-dialog/niveles-dialog.component';
import { TipoUsuariosDialogComponent } from './tipo-usuarios/tipo-usuarios-dialog/tipo-usuarios-dialog.component';
import { RolesDialogComponent } from './roles/roles-dialog/roles-dialog.component';
import { PeriodosDialogComponent } from './periodos/periodos-dialog/periodos-dialog.component';



@NgModule({
  declarations: [
    CursosParamComponent,
    ParametrosComponent,
    PeriodosComponent,
    DiaComponent,
    TipoUsuariosComponent,
    RolesComponent,
    NivelesComponent,
    DiaGrupoComponent,
    CursosDialogComponent,
    DiaDialogComponent,
    NivelesDialogComponent,
    TipoUsuariosDialogComponent,
    RolesDialogComponent,
    PeriodosDialogComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class ParametrosModule { }
