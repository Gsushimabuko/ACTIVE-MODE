import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeMainComponent } from './modules/home/home-main/home-main/home-main.component';


const routes: Routes = [
  {path: 'matricula', loadChildren: () =>
  import('./modules/matricula/matricula.module').then(m => m.MatriculaModule) },

  //Redirect
  {path: '', component: HomeMainComponent},
  {path: '**', redirectTo: '404'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }