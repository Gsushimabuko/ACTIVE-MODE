import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoListaComponent } from './curso-lista.component';

describe('CursoListaComponent', () => {
  let component: CursoListaComponent;
  let fixture: ComponentFixture<CursoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
