import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarMainComponent } from './calendar-main/calendar-main.component';
import { MaterialModule } from '../../core/material/material.module';
import {LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es'); //Esto no es un import, pero va justo despues de ellos!



@NgModule({
  declarations: [
    CalendarMainComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [
  {provide: LOCALE_ID, useValue: 'es'} // Añades esta línea en los providers
  ],
  exports:[
    CalendarMainComponent
  ]
})
export class CalendarModule { }
