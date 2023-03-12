import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDatePipe } from './is-date.pipe';
import { TypeofPipe } from './typeof.pipe';
import { ColumnNamePipe } from './column-name.pipe';
import { ObjectKeysPipe } from './object-keys.pipe';
import { ShowFilterPipe } from './show-filter.pipe';
import { WarningRowPipe } from './warning-row.pipe';
import { DictionaryPipe } from './dictionary.pipe';
import { IsArrayPipe } from './is-array.pipe';
import { ShowNameClientsPipe } from './show-name-clients.pipe';
import { IsButtonTable } from './isButtonTable.pipe';
import { IsStatusColumnTable } from './isStatusColumnTable.pipe';


@NgModule({
  declarations: [
    IsDatePipe,
    TypeofPipe,
    ColumnNamePipe,
    ObjectKeysPipe,
    ShowFilterPipe,
    WarningRowPipe,
    DictionaryPipe,
    IsArrayPipe,
    ShowNameClientsPipe,
    IsButtonTable,
    IsStatusColumnTable
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IsDatePipe,
    TypeofPipe,
    ColumnNamePipe,
    ObjectKeysPipe,
    ShowFilterPipe,
    WarningRowPipe,
    DictionaryPipe,
    IsArrayPipe,
    ShowNameClientsPipe,
    IsButtonTable,
    IsStatusColumnTable
  ]
})
export class PipesModule { }
