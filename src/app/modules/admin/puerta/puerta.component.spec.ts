import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuertaComponent } from './puerta.component';

describe('PuertaComponent', () => {
  let component: PuertaComponent;
  let fixture: ComponentFixture<PuertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
