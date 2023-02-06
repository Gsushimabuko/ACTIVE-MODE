import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminTokenGuard } from './guards/admin-token.guard';
import { ValidarTokenGuard } from './guards/token.guard';
import { HomeMainComponent } from './modules/home/home-main/home-main/home-main.component';
import { NoEncontradoComponent } from './modules/home/no-encontrado/no-encontrado.component';
import { TycComponent } from './modules/home/tyc/tyc.component';
import { PasarelaComponent } from './modules/pasarela/pasarela.component';


const routes: Routes = [
  {path: 'matricula', loadChildren: () =>
  import('./modules/matricula/matricula.module').then(m => m.MatriculaModule)
  ,canLoad: [ValidarTokenGuard],
  canActivate: [ValidarTokenGuard] },
  {path: 'pasarela', component: PasarelaComponent },
  {path: 'admin', loadChildren: () =>
  import('./modules/admin/admin.module').then(m => m.AdminModule),
  canLoad: [AdminTokenGuard],
  canActivate: [AdminTokenGuard]
},

//Not Guarded
  {path: 'login', loadChildren: () =>
  import('./modules/login/login.module').then(m => m.LoginModule)},
  {path: '', component: HomeMainComponent},
  {path: 'terminos', component: TycComponent},
  {path: '**', component:NoEncontradoComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }