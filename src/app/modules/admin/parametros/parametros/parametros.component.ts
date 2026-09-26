import { Component } from '@angular/core';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent {
  // Lo que usan los cursos de cada periodo. El catálogo de cursos tiene su propia sección.
  parametros = [
    { titulo: 'Periodos', icono: 'date_range', ruta: './periodos', texto: 'Los meses de matrícula. También se crean y se abren a las familias desde Cursos por periodo.' },
    { titulo: 'Días y frecuencias', icono: 'calendar_view_week', ruta: './dia', texto: 'Cuántas veces por semana puede venir un alumno (1, 2 o 3), cuántas clases al mes son, y qué combinaciones de días puede elegir la familia (ej. "Lu y Mi"). Cada tarifa se define por frecuencia.' },
    { titulo: 'Horarios', icono: 'schedule', ruta: './niveles', texto: 'Las franjas en que se dictan los cursos y para quién son (ej. 5:00 – 6:00 pm · 8 a 12 años). Al abrir un curso eliges cuáles usa.' },
    { titulo: 'Tipos de usuario', icono: 'badge', ruta: './tipo-usuarios', texto: 'Definen qué tarifa paga cada alumno (familia del colegio, público general, trabajador).' },
    { titulo: 'Roles', icono: 'admin_panel_settings', ruta: './roles', texto: 'Los permisos de cada cuenta: familia, administración o portería.' },
  ];
}
