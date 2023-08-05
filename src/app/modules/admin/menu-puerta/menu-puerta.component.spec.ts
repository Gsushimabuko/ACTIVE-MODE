import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPuertaComponent } from './menu-puerta.component';

describe('MenuPuertaComponent', () => {
  let component: MenuPuertaComponent;
  let fixture: ComponentFixture<MenuPuertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPuertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPuertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
