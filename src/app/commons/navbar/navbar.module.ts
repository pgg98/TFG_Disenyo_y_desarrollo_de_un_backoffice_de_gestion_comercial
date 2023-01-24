import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { CommonsModule } from '../commons.module';
import { WarningDialog } from './warning-dialog/warning-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule  } from '@angular/material/progress-spinner';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PopoverModule } from 'ngx-smart-popover';

@NgModule({
  declarations: [
    WarningDialog
  ],
  imports: [
    CommonModule,
    CommonsModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PipesModule,
    PopoverModule
  ]
})
export class NavbarModule { }
