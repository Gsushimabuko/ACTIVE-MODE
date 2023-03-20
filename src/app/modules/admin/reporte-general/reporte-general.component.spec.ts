import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGeneralComponent } from './reporte-general.component';

describe('ReporteGeneralComponent', () => {
  let component: ReporteGeneralComponent;
  let fixture: ComponentFixture<ReporteGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
