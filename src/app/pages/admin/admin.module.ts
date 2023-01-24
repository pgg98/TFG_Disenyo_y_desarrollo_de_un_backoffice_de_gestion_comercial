import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonsModule } from '../../commons/commons.module';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
  ],
  exports: [

  ],
  imports: [
    CommonModule,
    CommonsModule,
    RouterModule,
    FormsModule,
    NgxImageCompressorModule,
    ReactiveFormsModule,
    CommonsModule,
    DragDropModule,
    MatTableModule,
    FlexLayoutModule,
  ]
})
export class AdminModule { }
