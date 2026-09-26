import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZPeriodoService } from 'src/app/core/http/z_periodo/z-periodo.service';

export const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export interface Periodo { id: number; mes: number; ano: number; estado: string }

export const etiquetaPeriodo = (p?: Periodo | null) => (p ? `${MESES[p.mes - 1]} ${p.ano}` : '');

// Selector de periodo del backoffice. El periodo elegido queda en la URL (?idPeriodo=)
// para que Resumen y Pagos muestren el mismo al pasar de uno a otro.
@Component({
  selector: 'app-selector-periodo',
  template: `
    <label class="am-campo selector">
      <span class="am-sr">Periodo</span>
      <span class="am-campo__control">
        <select (change)="elegir(+$any($event.target).value)" [disabled]="!periodos.length">
          <option *ngFor="let p of periodos" [value]="p.id" [selected]="p.id === idPeriodo">{{ etiqueta(p) }}{{ p.estado === 'ACTIVO' ? ' · activo' : '' }}</option>
        </select>
        <span class="am-icon am-campo__flecha" aria-hidden="true">expand_more</span>
      </span>
    </label>
  `,
  styles: ['.selector { min-width: 220px; } .selector select { height: 40px; }'],
})
export class SelectorPeriodoComponent {
  @Output() cambio = new EventEmitter<Periodo>();
  periodos: Periodo[] = [];
  idPeriodo = 0;
  etiqueta = etiquetaPeriodo;

  constructor(periodoService: ZPeriodoService, private route: ActivatedRoute, private router: Router) {
    periodoService.getPeriodosParam().subscribe((periodos: Periodo[]) => {
      // El más reciente primero; por defecto el primer periodo activo.
      this.periodos = [...periodos].sort((a, b) => b.ano - a.ano || b.mes - a.mes);
      const pedido = Number(this.route.snapshot.queryParamMap.get('idPeriodo'));
      const inicial = this.periodos.find((p) => p.id === pedido)
        ?? this.periodos.find((p) => p.estado === 'ACTIVO')
        ?? this.periodos[0];
      if (inicial) this.elegir(inicial.id);
    });
  }

  elegir(id: number) {
    const periodo = this.periodos.find((p) => p.id === id);
    if (!periodo) return;
    this.idPeriodo = id;
    this.router.navigate([], { queryParams: { idPeriodo: id }, queryParamsHandling: 'merge', replaceUrl: true });
    this.cambio.emit(periodo);
  }
}
