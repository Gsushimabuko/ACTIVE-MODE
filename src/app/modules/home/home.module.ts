import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './home-main/home-main/home-main.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HomeMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomeModule { }
