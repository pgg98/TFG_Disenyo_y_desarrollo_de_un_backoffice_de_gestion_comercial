import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnFiltersCurve'
})
export class ColumnFiltersCurvesPipe implements PipeTransform {
  transform(value: any, key: string, typeTitle: boolean): any {
    if(value && value.constructor.name === 'Object' && value.seleccion) return 'Seleccionar todos';
    switch(key) {
      case 'areas': return typeTitle ? key : (value?.titulo || value?.nombre || value);
      case 'mes': return typeTitle ? key : (MonthsEnum[value]?.toLocaleLowerCase() || value); // ('Mes no definido')
      case 'riego': return typeTitle ? key : (IrrigationEnum[value]?.replace(/_/ig, ' ') || value); // 'Riego sin especificar'
      case 'tipo': return typeTitle ? key : `Desde ${value}`;
      case 'dds': return typeTitle ? 'tipo' : `Desde ${value == 0 ? 'Fs' : 'Fi'}`;
      case 'zona_eco': return typeTitle ? 'zona eco' : value;
      default: return typeTitle ? key : value;
    }
  }
}

enum MonthsEnum {
  ENERO = 1,
  FEBRERO = 2,
  MARZO = 3,
  ABRIL = 4,
  MAYO = 5,
  JUNIO = 6,
  JULIO = 7,
  AGOSTO = 8,
  SEPTIEMBRE = 9,
  OCTUBRE = 10,
  NOVIEMBRE = 11,
  DICIEMBRE = 12
}

enum IrrigationEnum {
  SIN_RIEGO = 0,
  CON_RIEGO = 1,
  GOTEO = 2,
  GRAVEDAD = 3,
  MECANIZADO = 4,
  PIVOTE = 5,
  PIVOTE_MOVIL = 6,
  FONTRAL_1_ALA = 7,
  FONTRAL_2_ALAS = 8,
  ASPERSION = 9,
  COMPUERTAS = 10,
  CARRETE = 11,
  RIEGO_TIPO_PARCELAS = 12
}
