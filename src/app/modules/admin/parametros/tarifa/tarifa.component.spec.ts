import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaComponent } from './tarifa.component';

describe('TarifaComponent', () => {
  let component: TarifaComponent;
  let fixture: ComponentFixture<TarifaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarifaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
