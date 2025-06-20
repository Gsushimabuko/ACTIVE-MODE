import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuertaAltComponent } from './puerta-alt.component';

describe('PuertaAltComponent', () => {
  let component: PuertaAltComponent;
  let fixture: ComponentFixture<PuertaAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuertaAltComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuertaAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
