import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'altasCellObjectFormat'
})
export class AltasCellObjectFormat implements PipeTransform {
  transform(element: any, key: string): any {
    let indexes = key.split('.')
    indexes.forEach(subkey => {
      element = element ? element[subkey] : null
    });

    return element
  }
}
