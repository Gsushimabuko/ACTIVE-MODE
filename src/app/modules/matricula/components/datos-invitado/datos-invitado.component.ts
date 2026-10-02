import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Mismas opciones y reglas que valida el backend (invitado.service.js).
export const RELACIONES = ['Externo', 'Alumno del colegio', 'Ex Alumno del colegio', 'Miembro de la cooperativa', 'Personal', 'Padre de familia', 'Otro'];

export function crearFormInvitado(fb: FormBuilder): FormGroup {
  return fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom: [''],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
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
  `],
})
export class DatosInvitadoComponent {
  @Input() form!: FormGroup;
  // "relacion": solo el selector de relación (va junto al Periodo). "datos": datos del alumno y contacto.
  @Input() parte: 'relacion' | 'datos' = 'datos';
  @Output() relacionCambio = new EventEmitter<string>();
  relaciones = RELACIONES;

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && c.touched;
  }
}
