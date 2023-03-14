import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasarelaComponent } from './pasarela.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { OnlyNumberDirective } from 'src/app/directives/only-number.directive';
import { DirectivesModule } from 'src/app/directives/directives.module';



@NgModule({
  declarations: [
    PasarelaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    DirectivesModule
  ],
  exports:[
    PasarelaComponent,
  ]
})
export class PasarelaModule { }
