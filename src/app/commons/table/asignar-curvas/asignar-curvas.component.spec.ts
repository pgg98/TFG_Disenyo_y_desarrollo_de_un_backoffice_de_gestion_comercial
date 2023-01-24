import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarCurvasComponent } from './asignar-curvas.component';

describe('AsignarCurvasComponent', () => {
  let component: AsignarCurvasComponent;
  let fixture: ComponentFixture<AsignarCurvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarCurvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarCurvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
