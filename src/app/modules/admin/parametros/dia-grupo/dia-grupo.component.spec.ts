import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaGrupoComponent } from './dia-grupo.component';

describe('DiaGrupoComponent', () => {
  let component: DiaGrupoComponent;
  let fixture: ComponentFixture<DiaGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiaGrupoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
