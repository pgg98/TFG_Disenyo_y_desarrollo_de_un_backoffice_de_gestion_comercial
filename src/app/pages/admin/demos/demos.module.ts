import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemosComponent } from './demos.component';
import { CommonsModule } from 'src/app/commons/commons.module';


@NgModule({
  declarations: [DemosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule
  ]
})
export class DemosModule { }
