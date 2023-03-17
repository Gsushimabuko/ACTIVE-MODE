import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaExtemporaneaComponent } from './matricula-extemporanea.component';

describe('MatriculaExtemporaneaComponent', () => {
  let component: MatriculaExtemporaneaComponent;
  let fixture: ComponentFixture<MatriculaExtemporaneaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatriculaExtemporaneaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculaExtemporaneaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
