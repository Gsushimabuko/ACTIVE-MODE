import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaMainComponent } from './components/matricula-main/matricula-main.component';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { MisCursosComponent } from './components/mis-cursos/mis-cursos.component';
import { FamiliaComponent } from './components/familia/familia.component';
import { ShellComponent } from './components/shell/shell.component';
import { CursoDetalleComponent } from './components/curso-detalle/curso-detalle.component';
import { FamiliarNuevoComponent } from './components/familiar-nuevo/familiar-nuevo.component';
import { FamiliarDetalleComponent } from './components/familiar-detalle/familiar-detalle.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { RequiereCuentaComponent } from './components/requiere-cuenta/requiere-cuenta.component';
import { CuentaGuard } from 'src/app/guards/cuenta.guard';


const routes: Routes = [
  {
    path: '', component: ShellComponent, children: [
      { path: '', component: MatriculaMainComponent },
      { path: 'dashboard', component: DasboardComponent },
      { path: 'curso/:idCursoPeriodo', component: CursoDetalleComponent },
      { path: 'calendario', component: MisCursosComponent, canActivate: [CuentaGuard], data: { seccion: 'calendario' } },
      { path: 'cursos', redirectTo: 'calendario', pathMatch: 'full' },
      { path: 'familia', component: FamiliaComponent, canActivate: [CuentaGuard], data: { seccion: 'familia' } },
      { path: 'familia/nuevo', component: FamiliarNuevoComponent, canActivate: [CuentaGuard], data: { seccion: 'familia' } },
      { path: 'familia/:id', component: FamiliarDetalleComponent, canActivate: [CuentaGuard], data: { seccion: 'familia' } },
      { path: 'configuracion', component: ConfiguracionComponent, canActivate: [CuentaGuard], data: { seccion: 'configuracion' } },
      { path: 'requiere-cuenta', component: RequiereCuentaComponent },
    ]
  },
  { path: '**', redirectTo: '404'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { }
