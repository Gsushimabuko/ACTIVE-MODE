import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosParamComponent } from './cursos/cursos-param.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { TarifaComponent } from './tarifa/tarifa.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { FrecuenciasComponent } from './frecuencias/frecuencias.component';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    CursosParamComponent,
    ParametrosComponent,
    TarifaComponent,
    PeriodosComponent,
    FrecuenciasComponent
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
