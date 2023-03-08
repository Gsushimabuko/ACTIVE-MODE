import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosParamComponent } from './cursos-param.component';

describe('CursosParamComponent', () => {
  let component: CursosParamComponent;
  let fixture: ComponentFixture<CursosParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosParamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
