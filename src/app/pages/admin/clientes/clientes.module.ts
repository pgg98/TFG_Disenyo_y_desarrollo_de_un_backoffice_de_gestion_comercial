import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesComponent } from './clientes.component';
import { CommonsModule } from 'src/app/commons/commons.module';


@NgModule({
  declarations: [ClientesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonsModule
  ]
})
export class ClientesModule { }
