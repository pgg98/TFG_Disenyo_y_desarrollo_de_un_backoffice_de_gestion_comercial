import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningDialog } from './warning-dialog.component';

describe('WarningDialog', () => {
  let component: WarningDialog;
  let fixture: ComponentFixture<WarningDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
