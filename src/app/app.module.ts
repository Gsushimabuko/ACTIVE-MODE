import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './core/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PasarelaComponent } from './modules/pasarela/pasarela.component';
import { ScriptService } from './services/script.service';
import { PasarelaModule } from './modules/pasarela/pasarela.module';
import { HomeModule } from './modules/home/home.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    PasarelaModule,
    HomeModule

  ],
  providers: [ScriptService],
  bootstrap: [AppComponent]
})
export class AppModule { }
