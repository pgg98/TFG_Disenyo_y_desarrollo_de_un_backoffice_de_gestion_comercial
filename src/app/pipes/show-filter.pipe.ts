import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showFilter'
})
export class ShowFilterPipe implements PipeTransform {

  transform(key: string): string {
    let container = key.split('__'), column = '';
    if(key.includes('fk')) column = container[1];
    else column = container[0];
    return column.toLowerCase();
  }

}
