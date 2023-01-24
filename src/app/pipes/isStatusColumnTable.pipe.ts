import { Pipe, PipeTransform } from '@angular/core';
import { StatusColumnTable } from '../interfaces/StatusColumnTable';

@Pipe({
  name: 'isStatusColumnTable'
})
export class IsStatusColumnTable implements PipeTransform {
  transform(value: any): boolean {
    return value instanceof StatusColumnTable ||
    (value && Object.keys(value).length === 3 && ['color', 'message', 'status'].every(e => Object.keys(value).includes(e)));
  }
}
