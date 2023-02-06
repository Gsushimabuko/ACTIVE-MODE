import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TycComponent } from './tyc.component';

describe('TycComponent', () => {
  let component: TycComponent;
  let fixture: ComponentFixture<TycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
