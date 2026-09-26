import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PeriodosComponent } from "./periodos/periodos.component";
import { ParametrosComponent } from "./parametros/parametros.component";
import { TipoUsuariosComponent } from './tipo-usuarios/tipo-usuarios.component';
import { DiaComponent } from './dia/dia.component';
import { DiaGrupoComponent } from "./dia-grupo/dia-grupo.component";
import { NivelesComponent } from './niveles/niveles.component';
import { RolesComponent } from './roles/roles.component';


const routes: Routes = [

  // El catálogo de cursos ahora tiene su propia sección, con la ficha del curso.
  { path: 'cursos', redirectTo: '/admin/catalogo', pathMatch: 'full' }, 
  { path: 'periodos', component: PeriodosComponent },
  { path: 'dia', component: DiaComponent}, 
  { path: 'dia-grupos', component: DiaGrupoComponent },
  { path: 'tipo-usuarios', component: TipoUsuariosComponent },
  { path: 'niveles', component: NivelesComponent}, 
  { path: 'roles', component: RolesComponent},
  { path: '', component: ParametrosComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }
