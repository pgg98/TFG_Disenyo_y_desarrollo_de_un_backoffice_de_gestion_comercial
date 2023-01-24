import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isSameFilter'
})
export class IsSameFilterPipe implements PipeTransform {
  transform(filter1: Object, filter2: Object): boolean {
    return JSON.stringify(filter1) === JSON.stringify(filter2);
  }
}
