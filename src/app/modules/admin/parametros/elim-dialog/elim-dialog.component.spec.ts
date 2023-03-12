import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElimDialogComponent } from './elim-dialog.component';

describe('ElimDialogComponent', () => {
  let component: ElimDialogComponent;
  let fixture: ComponentFixture<ElimDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElimDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElimDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
