import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesarFsComponent } from './reprocesar-fs.component';

describe('ReprocesarFsComponent', () => {
  let component: ReprocesarFsComponent;
  let fixture: ComponentFixture<ReprocesarFsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesarFsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprocesarFsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
