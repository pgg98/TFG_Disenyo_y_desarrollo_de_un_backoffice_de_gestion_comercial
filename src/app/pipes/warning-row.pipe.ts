import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'warningRow'
})
export class WarningRowPipe implements PipeTransform {
  transform(element: any, f: Function): boolean {
    if(!f) return false;
    return f(element);
  }
}
