import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchclientes'
})
export class SearchClientesPipe implements PipeTransform {
  transform(items: any[], searchText: string, labelSearch?: string): any[] {
    if(!items || !items.length || !searchText || !searchText.length) return items;
    return items.filter(item => {
      return (typeof items === 'string') && item.includes(searchText) ||
      (typeof items === 'number') && (item + '').includes(searchText) ||
      labelSearch && item[labelSearch] && item[labelSearch].includes(searchText);
    });
  }
}
