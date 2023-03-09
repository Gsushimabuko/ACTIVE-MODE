import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaDialogComponent } from './dia-dialog.component';

describe('DiaDialogComponent', () => {
  let component: DiaDialogComponent;
  let fixture: ComponentFixture<DiaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
