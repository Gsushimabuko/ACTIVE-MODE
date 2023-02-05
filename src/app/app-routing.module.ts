import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminTokenGuard } from './guards/admin-token.guard';
import { ValidarTokenGuard } from './guards/token.guard';
import { HomeMainComponent } from './modules/home/home-main/home-main/home-main.component';
import { PasarelaComponent } from './modules/pasarela/pasarela.component';


const routes: Routes = [
  {path: 'matricula', loadChildren: () =>
  import('./modules/matricula/matricula.module').then(m => m.MatriculaModule)
  ,canLoad: [ValidarTokenGuard],
  canActivate: [ValidarTokenGuard] },
  {path: 'login', loadChildren: () =>
  import('./modules/login/login.module').then(m => m.LoginModule)},
  {path: 'pasarela', component: PasarelaComponent },

  { path: 'admin', loadChildren: () =>
  import('./modules/admin/admin.module').then(m => m.AdminModule),
  canLoad: [AdminTokenGuard],
  canActivate: [AdminTokenGuard]
  },

  //Redirect
  {path: '', component: HomeMainComponent},
  {path: '**', redirectTo: '404'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }