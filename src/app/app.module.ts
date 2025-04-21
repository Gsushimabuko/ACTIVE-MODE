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
import { ScriptService2 } from './services/script.service';
import { PasarelaModule } from './modules/pasarela/pasarela.module';
import { HomeModule } from './modules/home/home.module';
import { registerLocaleData } from '@angular/common';
import { BotonPagoComponent } from './modules/shared/boton-pago/boton-pago.component';
import { PagosComponent } from './modules/pagos/pagos.component';
import { InfoDialogComponent } from './modules/shared/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from './modules/shared/error-dialog/error-dialog.component';
import { LoaderComponent } from './modules/shared/loader/loader.component';

registerLocaleData(localeEs, 'es-PE');

@NgModule({
  declarations: [
    AppComponent,
    BotonPagoComponent,
    PagosComponent,
    InfoDialogComponent,
    ErrorDialogComponent,
    LoaderComponent,

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
  providers: [ScriptService2,
    { provide: LOCALE_ID, useValue: 'es-PE' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
