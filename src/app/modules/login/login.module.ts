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



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoginRouterModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LoginModule { }
