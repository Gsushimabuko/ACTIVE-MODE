// Formatos compartidos del backoffice para días y horarios.

// 0 = domingo, como Date.getDay() y z_curso_periodo.dias.
export const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
// Orden de la semana para mostrar: lunes primero.
export const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0];

// 1700 -> "5:00 pm", 1130 -> "11:30 am"
export function hora(hhmm: number): string {
  const h = Math.floor(hhmm / 100), m = hhmm % 100;
  const sufijo = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

// "5:00 – 6:00 pm" (mismo sufijo) o "11:00 am – 12:00 pm"
export function franja(inicio: number, fin: number): string {
  const a = hora(inicio), b = hora(fin);
  return a.slice(-2) === b.slice(-2) ? `${a.slice(0, -3)} – ${b}` : `${a} – ${b}`;
}

// Días de la semana en texto: [1, 3] -> "Lun y Mié"
export function textoDias(dias: number[]): string {
  const nombres = ORDEN_SEMANA.filter((d) => dias.includes(d)).map((d) => DIAS_CORTOS[d]);
  return nombres.length > 1 ? `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}` : nombres.join('');
}

// Cuántas clases tiene el mes (1-12) en esos días de la semana.
export function clasesEnElMes(ano: number, mes: number, dias: number[]): number {
  let n = 0;
  const d = new Date(ano, mes - 1, 1);
  while (d.getMonth() === mes - 1) {
    if (dias.includes(d.getDay())) n++;
    d.setDate(d.getDate() + 1);
  }
  return n;
}
