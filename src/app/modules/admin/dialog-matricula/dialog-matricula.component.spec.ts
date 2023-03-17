import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMatriculaComponent } from './dialog-matricula.component';

describe('DialogMatriculaComponent', () => {
  let component: DialogMatriculaComponent;
  let fixture: ComponentFixture<DialogMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
