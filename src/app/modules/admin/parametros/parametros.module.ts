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
import { ParaDialogComponent } from './para-dialog/para-dialog.component';



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
    ParaDialogComponent,
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
