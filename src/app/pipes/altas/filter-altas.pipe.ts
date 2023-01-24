import { Pipe, PipeTransform } from '@angular/core';
import { FilterAlta } from '../../interfaces/altas/Altas.interface';

@Pipe({
  name: 'filterAltas'
})
export class FilterAltasPipe implements PipeTransform {
  private fields = [ 'area.client.workspace', 'area.name', 'type', 'client', 'status'];
  transform(filter: FilterAlta[], showAll: boolean = false): FilterAlta[] {
    return (showAll) ? filter :
    filter.filter(element => this.fields.includes(element.attribute));
  }
}
