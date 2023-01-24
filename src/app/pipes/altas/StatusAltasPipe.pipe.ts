import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusAltas'
})
export class StatusAltasPipe implements PipeTransform {
  transform(value: number): { value: string, color: string } {
    if(value < -1 || value > 3) return { value: value + '', color: 'black' };
    return {
      value: TypesStatus[value]?.replace(/_/ig, ' '),
      color: this.getColor(value)
    }
  }

  private getColor(value: number): string {
    switch(value) {
      case TypesStatus.QUEUE: return ColorsTypes.ORANGE;
      case TypesStatus.EXECUTING: return ColorsTypes.BLUE;
      case TypesStatus.ERROR: return ColorsTypes.RED;
      case TypesStatus.STOPPED: return ColorsTypes.GREY;
      case TypesStatus.COMPLETED: return ColorsTypes.GREEN;
      default: return ColorsTypes.ORANGE;
    }
  }
}

enum TypesStatus {
  QUEUE = 2,
  STOPPED = 0,
  ERROR = -1,
  EXECUTING = 3,
  COMPLETED = 1
}

enum ColorsTypes {
  RED = 'red',
  GREEN = 'green',
  ORANGE = 'orange',
  GREY = 'grey',
  BLACK = 'black',
  BLUE = 'blue'
}
