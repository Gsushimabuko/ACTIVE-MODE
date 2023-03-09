import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelesDialogComponent } from './niveles-dialog.component';

describe('NivelesDialogComponent', () => {
  let component: NivelesDialogComponent;
  let fixture: ComponentFixture<NivelesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
