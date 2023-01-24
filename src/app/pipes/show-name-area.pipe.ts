import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showNameArea'
})
export class ShowNameAreaPipe implements PipeTransform {
  /**
   * Pipe creado para mostrar el nombre de diferentes variables (originalmente de áreas)
   * @param value Variable de la que mostrar el nombre
   * @param areasAll Filtro para saber a que atributos acceder y como formatearlo
   * @returns Nombre formateado de la variable
   */
  transform(value: any,areasAll?:string): string {
    if(areasAll){
      if(value){return `${value.nombre} (${value.cliente.workspace} - ${value.cliente.nombre})`;}
      else{return null;}
    }else if(value){
      if(value.titulo){
        return value.titulo;
      }else if(value.nombre){
        return value.nombre;
      }
    }
  }

}
