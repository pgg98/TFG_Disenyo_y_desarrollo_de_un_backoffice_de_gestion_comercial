import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'altasFilterStyle'
})
export class AltasFilterStylePipe implements PipeTransform {

  transform(attribute: string, value: any, filters: any[]): boolean {
    if(filters && filters.find((el: any) => (el.value == attribute))){
      return true
    }else{
      return false
    }
  }

}
