import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteriaComponent } from './reporteria.component';

describe('ReporteriaComponent', () => {
  let component: ReporteriaComponent;
  let fixture: ComponentFixture<ReporteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
