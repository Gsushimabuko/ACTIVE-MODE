import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminTokenGuard } from './guards/admin-token.guard';
import { ValidarTokenGuard } from './guards/token.guard';
import { HomeMainComponent } from './modules/home/home-main/home-main/home-main.component';
import { NoEncontradoComponent } from './modules/home/no-encontrado/no-encontrado.component';
import { TycComponent } from './modules/home/tyc/tyc.component';
import { PasarelaComponent } from './modules/pasarela/pasarela.component';
import { BotonPagoComponent } from './modules/shared/boton-pago/boton-pago.component';
import { PagosComponent } from './modules/pagos/pagos.component';
import { TransactionComponent } from './modules/transaction/transaction.component';


const routes: Routes = [
  {
    path: 'matricula', loadChildren: () =>
      import('./modules/matricula/matricula.module').then(m => m.MatriculaModule)
    , canLoad: [ValidarTokenGuard],
    canActivate: [ValidarTokenGuard]
  },
  { path: 'pasarela', component: PasarelaComponent },
  {
    path: 'admin', loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminTokenGuard],
    canActivate: [AdminTokenGuard]
  },

  //Not Guarded
  { path: 'test', component: BotonPagoComponent },
  { path: 'pagos/:id', component: PagosComponent },
  { path: 'transaccion/:uuid', component: TransactionComponent },
  {
    path: 'login', loadChildren: () =>
      import('./modules/login/login.module').then(m => m.LoginModule)
  },
  { path: '', component: HomeMainComponent },
  { path: 'terminos', component: TycComponent },
  { path: '**', component: NoEncontradoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }