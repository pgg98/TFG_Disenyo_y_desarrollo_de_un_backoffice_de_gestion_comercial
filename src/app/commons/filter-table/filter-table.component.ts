import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { getFilter, getLoading } from 'src/app/pages/admin/state/admin.selector';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import { columnsNoFilter, columnsTable } from '../constants/columnsTable';
import { TypeofColumns, TypesInColumns } from '../enums/typeofColumns.enum';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() tipoInput: string;
  @Input() disabled: boolean;
  @Input() eliminarFiltro: boolean;

  @Output() obtenerTipo:EventEmitter<string> = new EventEmitter();
  @Output() filtrarTabla:EventEmitter<any[]> = new EventEmitter();
  @Output() eliminarConFiltro:EventEmitter<Object> = new EventEmitter();

  @ViewChild('input') inputFilterHTML;

  columns: string[] = [];
  selectSelected: boolean = false;
  columnSelected: string;
  inputFilter: any;
  inputFocus: boolean = false;
  @Input() actualFilter: Object;
  @Input() loading: boolean;
  typesInColumns = TypesInColumns;
  typeofColumns = TypeofColumns;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private store: Store<AppState>,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    // obtener columnas de la tabla seleccionada
    this.columns = columnsTable[this.title.toLowerCase()];
    // por defecto, el tipo de input es text
    if(!this.tipoInput) this.tipoInput = 'text';
    this.clickListener();
    this.store.select(getLoading)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.loading = value;
      }
    );
  }

  ngOnChanges() {
    if(this.tipoInput === 'radio') this.inputFilter = 'true';
    if(this.title) this.columns = columnsTable[this.title.toLowerCase()].filter(element => !columnsNoFilter.includes(element.toLowerCase()));
    //if(this.title) this.columns = columnsTable[this.title.toLowerCase()];
    // deseleccionar una columna que no existte en la nueva tabla
    if(this.columnSelected && !this.columns.includes(this.columnSelected)) this.columnSelected = undefined;
  }

  /**
   * Función que escucha el cambio en el select
   * @param event
   * @param element elemento seleccionado
   */
  changeSelectSelected(event, element?: string) {
    if(!this.disabled) {
      this.selectSelected = !this.selectSelected;
      if(element) {
        this.columnSelected = element;
        this.inputFilter = undefined;
        this.obtenerTipo.emit(element);
      }
    }
    event.stopPropagation();
  }

  /**
   * Función que escucha el click de toda la página para de seleccionar el select
   * en caso de que se haya seleccionado
  */
  clickListener() {
    const body = document.getElementById('main-wrapper');
    body.addEventListener('click', (event) => {
      if(this.selectSelected) this.selectSelected = false;
    })
  }

  /**
   * Función que escucha el evento de clicar sobre el input en general y lo focaliza
   */
  focusInput(event) {
    this.inputFilterHTML.nativeElement.focus();
  }

  /**
   * Función que emite el evento del filtro nuevo siempre y cuando sean valores correctos
   */
  filtrar() {
    if(!(!this.columnSelected || (!this.inputFilter || this.inputFilter === ''))) {
      if(this.typeofColumns[this.columnSelected] === this.typesInColumns.BOOLEAN ||
        this.tipoInput === 'radio') this.inputFilter = this.inputFilter === 'true';
      // cambiar dato en caso de fecha
      if(this.typeofColumns[this.columnSelected] === this.typesInColumns.DATE) {
        this.inputFilter = this.cambiarADate(this.inputFilter);
      }
      this.filtrarTabla.emit([this.columnSelected, this.inputFilter]);
      //this.columnSelected = undefined;
      //this.tipoInput = 'text';
      this.inputFilter = undefined;
    } else {
      this.filtrarTabla.emit(undefined);
    }
  }

  /**
   * Función que transforma la fecha a una fecha normalizada
   * @param input tipo fecha que no está normalizado
   * @returns fecha tipo yyyy-mm-dd
   */
  cambiarADate(input: Date): string {
    const day = input.getDate();
    const month = input.getMonth() + 1;
    const year = input.getFullYear();

    return `${year}-${(month < 10) ? ('0' + month) : month}-${(day < 10) ? ('0' + day) : day}`;
  }

  /**
   * Limpiar tanto el filtro actual como los inputs del filtro
   */
  clearAllFilter() {
    //this.columnSelected = undefined;
    //this.tipoInput = 'text';
    this.inputFilter = undefined;
    if(this.actualFilter) {
      this.filtrarTabla.emit(['', '', { filtro: {} }]);
    }
  }

  /**
   * Manda info del filtro para que se pueda eliminar con él
   */
  sendEliminarConFiltro() {
    this.eliminarConFiltro.emit((this.actualFilter && this.actualFilter['filtro']) ? this.actualFilter['filtro'] : {});
  }

  /**
   * Función que elimina un filtro
   * @param column key a eliminar
   */
  clearFilter(column: string) {
    let filter = { filtro: { ... this.actualFilter['filtro'] } };
    delete filter['filtro'][column];
    this.filtrarTabla.emit(['', '', filter]);
  }
}
