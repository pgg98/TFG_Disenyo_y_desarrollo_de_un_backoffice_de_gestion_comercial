import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { act } from '@ngrx/effects';


@Component({
  selector: 'app-filter-curves',
  templateUrl: './filter-curves.component.html',
  styleUrls: ['./filter-curves.component.scss']
})
export class FilterCurvesComponent implements OnInit, OnChanges {
  @Input('columns') columns: { key: string, value: any | null }[] = []
  @Input('filter') actualFilter: Object = {};
  @Input('loading') loadingData: boolean = false;
  @Input('disabled') disabled: boolean = false;

  @Output('changeFilter') changeFilterEvent: EventEmitter<any> = new EventEmitter();

  selectedColumn: { key: string, value: any | null } = null;
  auxFilter: Object = {}

  constructor() { }

  ngOnInit() {
    this.initFilterColumn();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initFilterColumn();
    this.auxFilter = JSON.parse(JSON.stringify(this.actualFilter));
    this.restart();
  }

  private initFilterColumn(): void {
    if(!this.selectedColumn && this.columns?.length) {
      this.selectedColumn = this.columns[0];
    }
  }

  /**
   * Listen to any change in filter
   */
  changeSelectFilter() {
    if(Object.entries(this.auxFilter).some(([key, value]) => !value?.length)) {
      this.auxFilter = Object.entries(this.auxFilter)
      .filter(([key, value]) => value?.length)
      .reduce((acc, element) => {
        let [ key, value ] = element;
        return {
          ...acc,
          [key]: value
        }
      }, {})
    }
    this.auxFilter = JSON.parse(JSON.stringify(this.auxFilter));
  }

  /**
   * Listen to remove filter events of popover. It can remove one or remove all
   * @param key key to remove from filter
   * @returns
   */
  removeFilter(key: string): void {
    if(key) {
      // remove selected filter
      let prevFilter = JSON.parse(JSON.stringify(this.actualFilter));
      delete prevFilter[key];
      this.changeFilterEvent.emit(prevFilter);
      return;
    }
    // remove all filters
    this.changeFilterEvent.emit({});
  }

  /**
   * Emits filter to father component if it has any change
   */
  changeFilter() {
    if(JSON.stringify(this.auxFilter) !== JSON.stringify(this.actualFilter)) {
      this.changeFilterEvent.emit(this.auxFilter);
    }
  }

  /** OTHERS */

  /**
   * Function to group by item
   * @param item item to group by
   * @returns
   */
  groupByAll(item): string {
    return 'titulo';
  }

  /**
   * Function to get group value
   */
  getGroupValue(groupKey: string, children: any[]): Object {
    return { seleccion: 'Seleccionar todos' }
  }

  restart(){
    this.selectedColumn = this.columns[0];
  }
}
