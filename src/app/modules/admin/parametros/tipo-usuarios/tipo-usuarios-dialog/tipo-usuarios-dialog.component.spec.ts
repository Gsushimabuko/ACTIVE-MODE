import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoUsuariosDialogComponent } from './tipo-usuarios-dialog.component';

describe('TipoUsuariosDialogComponent', () => {
  let component: TipoUsuariosDialogComponent;
  let fixture: ComponentFixture<TipoUsuariosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoUsuariosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoUsuariosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
