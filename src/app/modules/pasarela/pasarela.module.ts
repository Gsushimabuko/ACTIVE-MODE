import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasarelaComponent } from './pasarela.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { OnlyNumber } from 'src/app/directives/only-number.directive';



@NgModule({
  declarations: [
    PasarelaComponent,
    OnlyNumber
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  exports:[
    PasarelaComponent
  ]
})
export class PasarelaModule { }
