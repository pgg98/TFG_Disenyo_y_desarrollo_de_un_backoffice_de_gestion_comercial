import { Pipe, PipeTransform } from '@angular/core';
import { nameColumns } from '../commons/constants/nameColumns';
import { ButtonColumnTable } from '../interfaces/buttonColumnTable';

@Pipe({
  name: 'isButtonTable'
})
export class IsButtonTable implements PipeTransform {
  transform(value: any): boolean {
    return value instanceof ButtonColumnTable;
  }
}
