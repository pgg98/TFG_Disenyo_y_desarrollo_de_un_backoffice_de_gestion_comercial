import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BajasComponent } from './bajas.component';
import { CommonsModule } from 'src/app/commons/commons.module';


@NgModule({
  declarations: [BajasComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule
  ]
})
export class BajasModule { }
