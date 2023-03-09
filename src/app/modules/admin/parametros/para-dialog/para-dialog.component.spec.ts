import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaDialogComponent } from './para-dialog.component';

describe('ParaDialogComponent', () => {
  let component: ParaDialogComponent;
  let fixture: ComponentFixture<ParaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
