import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '../commons/enums/Dictionary.enum';

@Pipe({
  name: 'dictionary'
})
export class DictionaryPipe implements PipeTransform {
  dictionary = Dictionary;
  transform(value: string): string {
    return (value) ? this.dictionary[value.toLocaleUpperCase()] || value : null;
  }

}
