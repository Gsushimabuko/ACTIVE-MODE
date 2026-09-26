import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';
import { BotonInvitadoComponent } from './boton-invitado.component';

@NgModule({
  declarations: [AuthLayoutComponent, BotonInvitadoComponent],
  imports: [CommonModule, RouterModule],
  exports: [AuthLayoutComponent, BotonInvitadoComponent],
})
export class AuthLayoutModule { }
