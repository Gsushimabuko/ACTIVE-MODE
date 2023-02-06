import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaMainComponent } from './components/matricula-main/matricula-main.component';
import { DasboardComponent } from './components/dasboard/dasboard.component';
import { MisCursosComponent } from './components/mis-cursos/mis-cursos.component';


const routes: Routes = [

  { path: '', component: MatriculaMainComponent },
  { path: 'dashboard', component: DasboardComponent },
  { path: 'cursos', component: MisCursosComponent },
  { path: '**', redirectTo: '404'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { }
