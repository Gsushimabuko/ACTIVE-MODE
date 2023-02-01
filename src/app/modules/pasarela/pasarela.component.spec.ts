import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasarelaComponent } from './pasarela.component';

describe('PasarelaComponent', () => {
  let component: PasarelaComponent;
  let fixture: ComponentFixture<PasarelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasarelaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasarelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
