import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "../login/admin/admin.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AlumnosComponent } from "./alumnos/alumnos.component";
import { CodigosComponent } from "./codigos/codigos.component";
import { CursosComponent } from "./cursos/cursos.component";


const routes: Routes = [

  { path: 'dashboard', component: AdminDashboardComponent}, 
  { path: 'alumnos', component: AlumnosComponent },
  { path: 'codigo', component: CodigosComponent },
  { path: 'cursos', component: CursosComponent }
  ,{path: 'parametros', loadChildren: () =>
  import('./parametros/parametros.module').then(m => m.ParametrosModule)}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
