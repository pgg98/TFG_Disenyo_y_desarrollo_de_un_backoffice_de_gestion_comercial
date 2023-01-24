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
import { SearchClientesPipe } from './searchClientes.pipe';
import { IsButtonTable } from './isButtonTable.pipe';import { ShowNameAreaPipe } from './show-name-area.pipe';import { IsStatusColumnTable } from './isStatusColumnTable.pipe';
import { ColumnFiltersCurvesPipe } from './columnFiltersCurves.pipe';
import { ObjectNoNullValuesPipe } from './ObjectNoNullValues.pipe';
import { IsSameFilterPipe } from './isSameFilter.pipe';
import { AltasFilterStylePipe } from './altas/altasFilterStyle.pipe';
import { FilterAltasPipe } from './altas/filter-altas.pipe';
import { StatusAltasPipe } from './altas/StatusAltasPipe.pipe';
import { AltasCellObjectFormat } from './altas/altasCellObjectFormat.pipe';
import { titleColumnsPipe } from './altas/titleColumns.pipe';


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
    ShowNameAreaPipe,
    SearchClientesPipe,
    IsButtonTable,
    IsStatusColumnTable,
    ColumnFiltersCurvesPipe,
    ObjectNoNullValuesPipe,
    IsSameFilterPipe,
    AltasFilterStylePipe,
    FilterAltasPipe,
    StatusAltasPipe,
    AltasCellObjectFormat,
    titleColumnsPipe
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
    ShowNameAreaPipe,
    SearchClientesPipe,
    IsButtonTable,
    IsStatusColumnTable,
    ColumnFiltersCurvesPipe,
    ObjectNoNullValuesPipe,
    IsSameFilterPipe,
    AltasFilterStylePipe,
    FilterAltasPipe,
    StatusAltasPipe,
    AltasCellObjectFormat,
    titleColumnsPipe
  ]
})
export class PipesModule { }
