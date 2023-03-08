import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PeriodosComponent } from "./periodos/periodos.component";
import { CursosParamComponent } from './cursos/cursos-param.component';
import { ParametrosComponent } from "./parametros/parametros.component";


const routes: Routes = [

  { path: 'cursos', component: CursosParamComponent}, 
  { path: 'periodos', component: PeriodosComponent },
  { path: '', component: ParametrosComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }
