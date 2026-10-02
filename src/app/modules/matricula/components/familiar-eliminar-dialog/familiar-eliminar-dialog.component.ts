import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-familiar-eliminar-dialog',
  template: `
    <div class="am dialogo">
      <span class="am-icon dialogo__icono" aria-hidden="true">person_remove</span>
      <h2 class="am-h2">Eliminar familiar</h2>
      <p class="am-sub">
        {{ data.nombre }} dejará de aparecer en tu familia. Sus matrículas y pagos anteriores se conservarán.
      </p>
      <div class="am-acciones">
        <button type="button" class="am-btn am-btn--secondary" [mat-dialog-close]="false">Cancelar</button>
        <button type="button" class="am-btn dialogo__eliminar" [mat-dialog-close]="true" cdkFocusInitial>Eliminar familiar</button>
      </div>
    </div>
  `,
  styles: [`
    .dialogo { max-width: 440px; display: flex; flex-direction: column; gap: 12px; padding: 24px; }
    .dialogo__icono { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--am-error-soft); color: var(--am-error); font-size: 24px; }
    .dialogo__eliminar { height: 44px; padding: 0 20px; border: 0; border-radius: 8px; background: var(--am-error); color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  `],
})
export class FamiliarEliminarDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { nombre: string }) { }
}
