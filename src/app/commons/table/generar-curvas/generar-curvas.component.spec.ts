import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCurvasComponent } from './generar-curvas.component';

describe('GenerarCurvasComponent', () => {
  let component: GenerarCurvasComponent;
  let fixture: ComponentFixture<GenerarCurvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCurvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCurvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
