import { Pipe, PipeTransform } from '@angular/core';
import { nameColumns } from '../commons/constants/nameColumns';

@Pipe({
  name: 'columnName'
})
export class ColumnNamePipe implements PipeTransform {

  transform(value: string): unknown {
    if(value.length === 0) return value;
    return (nameColumns[value]) ?
    nameColumns[value].charAt(0).toUpperCase() + nameColumns[value].slice(1) :
    value.charAt(0).toUpperCase() + value.slice(1);
  }

}
