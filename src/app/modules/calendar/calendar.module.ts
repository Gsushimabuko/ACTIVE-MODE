import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarMainComponent } from './calendar-main/calendar-main.component';
import { MaterialModule } from '../../core/material/material.module';



@NgModule({
  declarations: [
    CalendarMainComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    CalendarMainComponent
  ]
})
export class CalendarModule { }
