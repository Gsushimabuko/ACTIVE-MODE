import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DatosConfirmar { titulo: string; mensaje: string; confirmar: string; peligro?: boolean }

// Confirmación simple: se cierra con true si la persona confirma.
@Component({
  selector: 'app-confirmar-dialog',
  template: `
    <div class="am dialogo">
      <h2 class="am-h2">{{ datos.titulo }}</h2>
      <p class="am-sub">{{ datos.mensaje }}</p>
      <div class="am-acciones">
        <button type="button" class="am-btn am-btn--secondary" [mat-dialog-close]="false">Cancelar</button>
        <button type="button" class="am-btn am-btn--primary" [class.peligro]="datos.peligro" [mat-dialog-close]="true" cdkFocusInitial>{{ datos.confirmar }}</button>
      </div>
    </div>
  `,
  styles: [`
    .dialogo { display: flex; flex-direction: column; gap: 12px; padding: 24px; }
    .am .am-btn--primary.peligro { background: var(--am-error); }
  `],
})
export class ConfirmarDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosConfirmar) { }
}
