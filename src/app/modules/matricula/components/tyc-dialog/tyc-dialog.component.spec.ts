import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TycDialogComponent } from './tyc-dialog.component';

describe('TycDialogComponent', () => {
  let component: TycDialogComponent;
  let fixture: ComponentFixture<TycDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TycDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TycDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
