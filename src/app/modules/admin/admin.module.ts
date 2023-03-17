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
import { PeriodosComponent } from './parametros/periodos/periodos.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CursosParamComponent } from './parametros/cursos/cursos-param.component';
import { ParametrosModule } from './parametros/parametros.module';
import { CreacionCursosComponent } from './creacion-cursos/creacion-cursos.component';
import { CreacionCursoPeriodoComponent } from './creacion-curso-periodo/creacion-curso-periodo.component';
import { PasarelaModule } from '../pasarela/pasarela.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { EditarCursoPeriodoComponent } from './editar-curso-periodo/editar-curso-periodo.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    CursosComponent,
    AlumnosComponent,
    CodigosComponent,
    CreacionCursosComponent,
    CreacionCursoPeriodoComponent,
    EditarCursoPeriodoComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    DirectivesModule
  ]
})
export class AdminModule { }
