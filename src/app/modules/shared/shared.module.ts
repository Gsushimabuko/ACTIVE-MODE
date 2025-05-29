import { NgModule } from '@angular/core';
import { SearchInputComponent } from './search-input/search-input.component';
import { TextDialogComponent } from './text-dialog/text-dialog.component';

@NgModule({
  declarations: [SearchInputComponent], // Declarar el componente SearchInputComponent
  exports: [SearchInputComponent], // Exportar para que otros módulos puedan usarlo
})
export class SharedModule {}