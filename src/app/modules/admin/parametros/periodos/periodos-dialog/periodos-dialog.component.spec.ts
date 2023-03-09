import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosDialogComponent } from './periodos-dialog.component';

describe('PeriodosDialogComponent', () => {
  let component: PeriodosDialogComponent;
  let fixture: ComponentFixture<PeriodosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
