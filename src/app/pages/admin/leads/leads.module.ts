import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadsComponent } from './leads.component';
import { CommonsModule } from 'src/app/commons/commons.module';


@NgModule({
  declarations: [LeadsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule
  ]
})
export class LeadsModule { }
