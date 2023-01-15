import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaMainComponent } from './components/matricula-main/matricula-main.component';

const routes: Routes = [

  { path: '', component: MatriculaMainComponent },
  { path: '**', redirectTo: '404'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { }
