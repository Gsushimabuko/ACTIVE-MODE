import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CursosComponent } from './cursos/cursos.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { CodigosComponent } from './codigos/codigos.component';
import { ParametrosComponent } from './parametros/parametros/parametros.component';
import { TarifaComponent } from './parametros/tarifa/tarifa.component';
import { PeriodosComponent } from './parametros/periodos/periodos.component';
import { FrecuenciasComponent } from './parametros/frecuencias/frecuencias.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CursosParamComponent } from './parametros/cursos/cursos-param.component';
import { ParametrosModule } from './parametros/parametros.module';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    CursosComponent,
    AlumnosComponent,
    CodigosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class AdminModule { }
