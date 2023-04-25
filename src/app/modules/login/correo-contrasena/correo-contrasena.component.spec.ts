import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorreoContrasenaComponent } from './correo-contrasena.component';

describe('CorreoContrasenaComponent', () => {
  let component: CorreoContrasenaComponent;
  let fixture: ComponentFixture<CorreoContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorreoContrasenaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorreoContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
