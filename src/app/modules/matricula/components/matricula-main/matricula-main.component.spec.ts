import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaMainComponent } from './matricula-main.component';

describe('MatriculaMainComponent', () => {
  let component: MatriculaMainComponent;
  let fixture: ComponentFixture<MatriculaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatriculaMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatriculaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
