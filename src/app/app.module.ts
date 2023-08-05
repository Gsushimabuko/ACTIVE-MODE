import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './core/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { PasarelaComponent } from './modules/pasarela/pasarela.component';
import { ScriptService } from './services/script.service';
import { PasarelaModule } from './modules/pasarela/pasarela.module';
import { HomeModule } from './modules/home/home.module';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es-PE');

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
  providers: [ScriptService,
    { provide: LOCALE_ID, useValue: 'es-PE' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
