import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCursoPeriodoComponent } from './creacion-curso-periodo.component';

describe('CreacionCursoPeriodoComponent', () => {
  let component: CreacionCursoPeriodoComponent;
  let fixture: ComponentFixture<CreacionCursoPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionCursoPeriodoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionCursoPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
