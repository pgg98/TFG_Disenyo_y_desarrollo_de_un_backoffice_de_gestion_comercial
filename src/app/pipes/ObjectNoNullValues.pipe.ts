import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectNoNullValues'
})
export class ObjectNoNullValuesPipe implements PipeTransform {
  transform(value: Object): { key: string, value: any }[] {
    if(!value || typeof value !== 'object') return [];
    return Object.entries(value).map(([ key, value ]) => {
      return {
        key: key,
        value: value
      }
    }).filter(e => e.value !== null);
  }
}
