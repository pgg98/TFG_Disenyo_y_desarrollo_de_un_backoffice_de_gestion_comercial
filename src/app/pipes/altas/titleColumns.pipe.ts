import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleColumns'
})
export class titleColumnsPipe implements PipeTransform {
  transform(value: string):string {
    switch(value) {
      case 'fin_actualizacion': return 'fin actualización';
      case 'ha_contrat_sent': return 'hectáreas contratadas sentinel';
      case 'areasTotal': return 'areas totales';
      case 'areasAvailable': return 'areas disponibles';
      case 'areasSelected': return 'areas seleccionadas';
      case 'bounding_box': return 'bounding box';
      default: return value;
    }
  }
}