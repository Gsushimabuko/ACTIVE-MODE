import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { LoginRouterModule } from './login-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { AuthLayoutModule } from '../shared/auth-layout/auth-layout.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    CambiarContrasenaComponent,
    RecuperarComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoginRouterModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthLayoutModule,
  ]
})
export class LoginModule { }
