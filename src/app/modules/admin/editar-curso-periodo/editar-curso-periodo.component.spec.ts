import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCursoPeriodoComponent } from './editar-curso-periodo.component';

describe('EditarCursoPeriodoComponent', () => {
  let component: EditarCursoPeriodoComponent;
  let fixture: ComponentFixture<EditarCursoPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCursoPeriodoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCursoPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
