import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { VerificacionDni } from 'src/app/core/http/pasarela/pasarela.service';

// Mismas opciones y reglas que valida el backend (invitado.service.js).
export const RELACIONES = ['Externo', 'Alumno del colegio', 'Ex Alumno del colegio', 'Miembro de la cooperativa', 'Personal', 'Padre de familia', 'Otro'];

// Consulta al backend si el DNI ya tiene cuenta, apenas tiene 8 dígitos (con
// una pausa corta para no consultar a cada tecla). Si la consulta falla (red,
// 429) no bloquea: el backend vuelve a validar al cobrar.
export function validadorDniDisponible(verificar: (dni: string) => Observable<VerificacionDni>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const dni = String(control.value || '').trim();
    if (!/^[0-9]{8}$/.test(dni)) return of(null);
    return timer(400).pipe(
      switchMap(() => verificar(dni)),
      map((r) => r.disponible ? null : { dniConCuenta: { motivo: r.motivo, mensaje: r.mensaje } }),
      catchError(() => of(null)),
    );
  };
}

export function crearFormInvitado(fb: FormBuilder, verificarDni?: (dni: string) => Observable<VerificacionDni>): FormGroup {
  return fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom: [''],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)], verificarDni ? [validadorDniDisponible(verificarDni)] : []],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    relacion: ['', [Validators.required]],
  });
}

// Misma regla de tarifa que el backend y el registro.
export function tipoUsuarioPorRelacion(relacion: string): number {
  if (relacion === 'Personal') return 3;
  if (relacion === 'Externo' || relacion === 'Otro') return 2;
  return 1;
}

@Component({
  selector: 'app-datos-invitado',
  templateUrl: './datos-invitado.component.html',
  // Los campos se ubican directo en el formulario del padre.
  styles: [`
    :host { display: contents; }
    .grupo { display: flex; flex-direction: column; gap: 12px; padding-top: 20px; border-top: 1px solid var(--am-divider); }
    .grupo__titulo { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--am-text-2); }
    .ayuda { font-size: 12px; font-weight: 400; color: var(--am-text-3); }
    .aviso-dni { align-items: flex-start; }
    .aviso-dni__texto { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
    .aviso-dni__boton { text-decoration: none; }
  `],
})
export class DatosInvitadoComponent {
  @Input() form!: FormGroup;
  // "relacion": solo el selector de relación (va junto al Periodo). "datos": datos del alumno y contacto.
  @Input() parte: 'relacion' | 'datos' = 'datos';
  @Output() relacionCambio = new EventEmitter<string>();
  // A dónde vuelve tras iniciar sesión desde el aviso de "DNI con cuenta".
  @Input() volverTrasLogin = '/matricula';
  relaciones = RELACIONES;

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && c.touched;
  }

  // Se muestra apenas llega la respuesta, sin esperar a que salga del campo.
  get dniConCuenta(): { motivo?: string; mensaje?: string } | null {
    return this.form.get('dni')!.errors?.['dniConCuenta'] || null;
  }

  get verificandoDni(): boolean {
    return this.form.get('dni')!.pending;
  }
}
