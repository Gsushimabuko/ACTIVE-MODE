import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "../login/admin/admin.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { AlumnosComponent } from "./alumnos/alumnos.component";
import { CodigosComponent } from "./codigos/codigos.component";
import { CreacionCursoPeriodoComponent } from "./creacion-curso-periodo/creacion-curso-periodo.component";
import { CreacionCursosComponent } from "./creacion-cursos/creacion-cursos.component";
import { CursosComponent } from "./cursos/cursos.component";
import { MatriculaExtemporaneaComponent } from './matricula-extemporanea/matricula-extemporanea.component';
import { PuertaComponent } from "./puerta/puerta.component";
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';
import { MenuPuertaComponent } from "./menu-puerta/menu-puerta.component";
import { EntradasComponent } from "./entradas/entradas/entradas.component";
import { PagosComponent } from "./pagos/pagos.component";


const routes: Routes = [

  { path: 'entradas', component: EntradasComponent}, 
  { path: 'menu-puerta', component: MenuPuertaComponent}, 
  { path: 'puerta', component: PuertaComponent}, 
  { path: 'dashboard', component: AdminDashboardComponent}, 
  { path: 'alumnos', component: AlumnosComponent },
  { path: 'codigo', component: CodigosComponent },
  { path: 'cursos', component: CursosComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'creacion', component: CreacionCursosComponent },
  { path: 'matricula-extemporanea', component: MatriculaExtemporaneaComponent },
  {path: 'reporte-general', component:ReporteGeneralComponent},
  { path: 'creacion-form/:periodoId', component: CreacionCursoPeriodoComponent },
  {path: 'parametros', loadChildren: () =>
  import('./parametros/parametros.module').then(m => m.ParametrosModule)}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
