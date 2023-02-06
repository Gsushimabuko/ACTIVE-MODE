import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './home-main/home-main/home-main.component';
import { RouterModule } from '@angular/router';
import { TycComponent } from './tyc/tyc.component';
import { NoEncontradoComponent } from './no-encontrado/no-encontrado.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from 'src/app/app.component';



@NgModule({
  declarations: [
    HomeMainComponent,
    TycComponent,
    NoEncontradoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
   MatIconModule
    
  ]
})
export class HomeModule { }
