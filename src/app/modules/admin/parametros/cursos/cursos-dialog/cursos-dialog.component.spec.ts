import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosDialogComponent } from './cursos-dialog.component';

describe('CursosDialogComponent', () => {
  let component: CursosDialogComponent;
  let fixture: ComponentFixture<CursosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
