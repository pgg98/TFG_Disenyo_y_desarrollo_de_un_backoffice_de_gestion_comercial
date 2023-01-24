import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { PhoneCode } from './phoneCode.pipe';
import { CompareShape } from './compareShape.pipe';

@NgModule({
  declarations:[
    PhoneCode,
    CompareShape
  ],
  imports:[CommonModule],
  exports:[
    PhoneCode,
    CompareShape
  ]
})

export class MainPipe{}
