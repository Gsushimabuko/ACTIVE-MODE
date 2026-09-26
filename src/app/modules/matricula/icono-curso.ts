// Ícono del curso según su nombre. Se usa cuando el curso no tiene foto (z_curso.imagen).
const ICONOS: [RegExp, string][] = [
  [/nataci|piscina|agua/i, 'pool'],
  [/f[uú]tbol|futsal/i, 'sports_soccer'],
  [/b[aá]squet|basket/i, 'sports_basketball'],
  [/v[oó]le[iy]/i, 'sports_volleyball'],
  [/tenis|p[aá]del/i, 'sports_tennis'],
  [/danza|baile|ballet|marinera|folklore|salsa|k\s*-?\s*pop/i, 'music_note'],
  [/ajedrez/i, 'extension'],
  [/karate|judo|taekwondo|\btkd\b|artes marciales/i, 'sports_martial_arts'],
  [/cross|funcional/i, 'fitness_center'],
  [/gimnasia|yoga|pilates/i, 'sports_gymnastics'],
  [/atletismo|running/i, 'directions_run'],
  [/m[uú]sica|guitarra|piano/i, 'music_note'],
  [/pintura|arte|dibujo/i, 'palette'],
];

export function iconoCurso(nombre: string = ''): string {
  const encontrado = ICONOS.find(([patron]) => patron.test(nombre));
  return encontrado ? encontrado[1] : 'sports';
}
