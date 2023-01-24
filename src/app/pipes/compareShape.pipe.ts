import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compareShape'
})
export class CompareShape implements PipeTransform {

  transform(polygons: any[], status: number): number {
    // new=2, edit=1, delete=0, fileToGeojson: null
    if(polygons && status != null){
      var result = polygons.filter(obj => {return obj.status==status}).length
    }else{
      result = polygons.length
    }

    return result;
  }
}