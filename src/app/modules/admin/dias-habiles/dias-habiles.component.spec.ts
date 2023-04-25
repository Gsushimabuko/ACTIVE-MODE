import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasHabilesComponent } from './dias-habiles.component';

describe('DiasHabilesComponent', () => {
  let component: DiasHabilesComponent;
  let fixture: ComponentFixture<DiasHabilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiasHabilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiasHabilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
