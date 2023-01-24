import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showNameClients'
})
export class ShowNameClientsPipe implements PipeTransform {

  transform(value: number[]): string {
    return value.map(element => {
      return element['nombre']
    }).join(', ');
  }

}
