import { FormBuilder } from '@angular/forms';
import { convertToParamMap } from '@angular/router';
import { crearFormInvitado } from '../datos-invitado/datos-invitado.component';
import { MatriculaMainComponent } from './matricula-main.component';

describe('Matrícula', () => {
  const fb = new FormBuilder();

  it('rechaza DNI, celular y correo inválidos del invitado', () => {
    const form = crearFormInvitado(fb);
    form.patchValue({ nombre: 'Ana', apellidop: 'Pérez', dni: '12345678', correo: 'ana@ejemplo.org', telefono: '987654321', relacion: 'Externo' });
    expect(form.valid).toBeTrue();
    form.patchValue({ dni: '1234567a' });
    expect(form.invalid).toBeTrue();
    form.patchValue({ dni: '12345678', telefono: '98765432' });
    expect(form.invalid).toBeTrue();
    form.patchValue({ telefono: '987654321', correo: 'sin-arroba' });
    expect(form.invalid).toBeTrue();
  });

  it('preselecciona el curso y periodo exactos de su ficha', () => {
    const component = Object.create(MatriculaMainComponent.prototype) as MatriculaMainComponent;
    const state = component as any;
    state.route = { snapshot: { queryParamMap: convertToParamMap({ idCurso: '7', idCursoPeriodo: '42', mes: '9', ano: '2026' }) } };
    state.meses = [{ periodo_fecha: '2026-10-01T12:00:00.000Z' }];
    state.mesForm = fb.group({ mes: [''] });
    spyOn(component, 'seleccionMes');
    state.preseleccionarPeriodo();
    expect(component.cursoPreseleccionado).toBe(7);
    expect(component.cursoPeriodoPreseleccionado).toBe(42);
    expect(component.mesForm.value.mes).toBe(state.meses[0].periodo_fecha);

    component.invitado = false;
    component.cursos = [
      { idCurso: 1, idCursoPeriodo: 40, state: 'MATRICULA' },
      { idCurso: 7, idCursoPeriodo: 42, state: 'MATRICULA' },
    ] as any;
    component.cursoForm = fb.group({ curso: [''] });
    spyOn(component, 'cambioCurso');
    state.aplicarCursoPreseleccionado();
    expect(component.cursoForm.value.curso).toBe(7);
    expect(component.cambioCurso).toHaveBeenCalled();
  });

  it('bloquea el pago si los datos dejan de ser válidos después de agregar un curso', () => {
    const component = Object.create(MatriculaMainComponent.prototype) as MatriculaMainComponent;
    component.invitado = true;
    component.invitadoForm = crearFormInvitado(fb);
    component.listaCursosNuevos = [{ idCursoPeriodo: 42 }];
    component.paso = 1;
    component.continuarAlPago();
    expect(component.paso).toBe(1);
    expect(component.faltanDatosInvitado).toBeTrue();
  });
});
