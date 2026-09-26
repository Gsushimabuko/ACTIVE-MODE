import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Mismas opciones y reglas que valida el backend (invitado.service.js).
export const RELACIONES = ['Externo', 'Alumno del colegio', 'Ex Alumno del colegio', 'Miembro de la cooperativa', 'Personal', 'Padre de familia', 'Otro'];

export function crearFormInvitado(fb: FormBuilder): FormGroup {
  return fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom: [''],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z]{8,12}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^[0-9 +]{7,15}$/)]],
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
  // Los campos se ubican directo en la grilla del formulario del padre.
  styles: [':host { display: contents; }'],
})
export class DatosInvitadoComponent {
  @Input() form!: FormGroup;
  @Output() relacionCambio = new EventEmitter<string>();
  relaciones = RELACIONES;

  invalido(campo: string): boolean {
    const c = this.form.get(campo)!;
    return c.invalid && c.touched;
  }
}
