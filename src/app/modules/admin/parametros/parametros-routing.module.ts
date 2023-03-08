import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FrecuenciasComponent } from "./frecuencias/frecuencias.component";
import { PeriodosComponent } from "./periodos/periodos.component";
import { TarifaComponent } from "./tarifa/tarifa.component";
import { CursosParamComponent } from './cursos/cursos-param.component';
import { ParametrosComponent } from "./parametros/parametros.component";


const routes: Routes = [

  { path: 'cursos', component: CursosParamComponent}, 
  { path: 'frecuencias', component: FrecuenciasComponent},
  { path: 'periodos', component: PeriodosComponent },
  { path: 'tarifa', component: TarifaComponent },
  { path: '', component: ParametrosComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }
