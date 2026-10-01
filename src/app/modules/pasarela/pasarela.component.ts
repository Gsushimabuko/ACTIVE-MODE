import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatosInvitado, PasarelaService } from 'src/app/core/http/pasarela/pasarela.service';

export type ResultadoPago =
  | { estado: 'pendiente'; paymentUrl: string; chargeId: string }
  | { estado: 'exitoso' }
  | { estado: 'fallido'; mensaje: string; status: number; codigo?: string };

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent {
  @Input() cursos: any[] = [];
  @Input() alumno: string = '';
  @Input() idUsuario!: number;
  @Input() invitado: DatosInvitado | null = null;
  @Input() monto!: number;
  @Input() fechaCalendario!: Date;
  @Output() volver = new EventEmitter<void>();
  @Output() verTerminos = new EventEmitter<void>();
  @Output() resultado = new EventEmitter<ResultadoPago>();

  aceptaTerminos: boolean = false;
  procesando: boolean = false;

  constructor(private pasarelaService: PasarelaService) { }

  pagar() {
    if (this.procesando || !this.aceptaTerminos) return;
    this.procesando = true;

    // La pestaña se abre en el mismo clic: si se abre después del await, Safari y Firefox la bloquean.
    const pestana = window.open('', '_blank');
    if (pestana) pestana.opener = null;

    const ano = this.fechaCalendario.getFullYear();
    const mes = this.fechaCalendario.getMonth();

    this.pasarelaService.createPayment(this.monto, this.cursos, this.idUsuario, ano, mes, this.invitado).subscribe({
      next: (cargo) => {
        if (!pestana) {
          // Guarda primero el estado pendiente en el padre. Si el navegador
          // bloqueó el popup y debemos usar esta pestaña, "Atrás" podrá
          // reconstruir íntegramente la matrícula desde sessionStorage.
          this.resultado.emit({ estado: 'pendiente', paymentUrl: cargo.paymentUrl, chargeId: cargo.chargeId });
          setTimeout(() => window.location.assign(cargo.paymentUrl), 50);
          return;
        }
        pestana.location.href = cargo.paymentUrl;
        this.procesando = false;
        this.resultado.emit({ estado: 'pendiente', paymentUrl: cargo.paymentUrl, chargeId: cargo.chargeId });
      },
      error: (error: any) => {
        pestana?.close();
        this.procesando = false;
        this.resultado.emit({
          estado: 'fallido',
          mensaje: error.error?.mensaje || 'No pudimos conectar con la pasarela.',
          status: error.status,
          codigo: error.error?.codigo,
        });
      }
    });
  }
}
