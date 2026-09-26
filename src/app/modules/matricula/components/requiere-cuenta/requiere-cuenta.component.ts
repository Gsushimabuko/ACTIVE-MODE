import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const SECCIONES: Record<string, { icono: string; titulo: string; texto: string }> = {
  calendario: {
    icono: 'calendar_month',
    titulo: 'El calendario está disponible con una cuenta',
    texto: 'Con tu cuenta, las clases de cada familiar aparecen aquí apenas se confirma el pago.',
  },
  configuracion: {
    icono: 'settings',
    titulo: 'La configuración requiere una cuenta',
    texto: 'Como invitado no guardamos datos de perfil. Crea una cuenta para gestionar tus datos y tu contraseña.',
  },
  familia: {
    icono: 'group',
    titulo: 'Familia está disponible con una cuenta',
    texto: 'Registra una vez a tus hijos y allegados, y matricúlalos después en segundos sin volver a escribir sus datos.',
  },
};

@Component({
  selector: 'app-requiere-cuenta',
  templateUrl: './requiere-cuenta.component.html',
  styleUrls: ['./requiere-cuenta.component.css']
})
export class RequiereCuentaComponent {
  seccion = SECCIONES['familia'];
  beneficios = [
    { icono: 'group', texto: 'Guarda a tu familia y matricula sin repetir datos' },
    { icono: 'calendar_month', texto: 'Ve todas las clases en un solo calendario' },
  ];

  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe((q) => (this.seccion = SECCIONES[q.get('seccion') ?? ''] ?? SECCIONES['familia']));
  }
}
