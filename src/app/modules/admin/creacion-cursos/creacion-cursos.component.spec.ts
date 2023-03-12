import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionCursosComponent } from './creacion-cursos.component';

describe('CreacionCursosComponent', () => {
  let component: CreacionCursosComponent;
  let fixture: ComponentFixture<CreacionCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionCursosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
