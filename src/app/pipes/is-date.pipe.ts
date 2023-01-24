import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isDate'
})
export class IsDatePipe implements PipeTransform {

  transform(value: any): boolean {
    if(typeof value !== 'string') return (value instanceof Date);
    let reg = new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    return reg.test(value);
  }

}
