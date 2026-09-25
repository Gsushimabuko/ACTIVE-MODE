import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasarelaComponent } from './pasarela.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { EstadoPagoComponent } from './estado-pago/estado-pago.component';

@NgModule({
  declarations: [
    PasarelaComponent,
    EstadoPagoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports:[
    PasarelaComponent,
    EstadoPagoComponent,
  ]
})
export class PasarelaModule { }
