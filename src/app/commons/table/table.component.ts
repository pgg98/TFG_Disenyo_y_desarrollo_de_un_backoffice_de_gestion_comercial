import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Pagination } from 'src/app/interfaces/Pagination.interface';
import { getLoading } from 'src/app/pages/admin/state/admin.selector';
import { AppState } from 'src/app/store/app.state';
import { takeUntil } from 'rxjs/operators';
import { columnsNoChangeOrder, columnsTable } from '../constants/columnsTable';
import Swal from 'sweetalert2';
import { botonesTabla } from '../enums/botonesTabla.enum';
import { categories } from '../enums/categories';
import { loadSuperusers } from 'src/app/auth/state/auth.actions';
import { ColumnNamePipe } from 'src/app/pipes/column-name.pipe';
import { setShowUsers } from 'src/app/pages/admin/state/admin.actions';
import { CommonService } from 'src/app/services/Common.service';
import { IsButtonTable } from 'src/app/pipes/isButtonTable.pipe';
import { IsStatusColumnTable } from 'src/app/pipes/isStatusColumnTable.pipe';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: Pagination;
  @Input() datos: Object[];
  @Input() title: string;
  @Input() buttons: botonesTabla[];
  @Input() warning: any[];
  @Input() danger: any[];
  @Input() page: number;
  @Input() disabledPagination: boolean;
  @Input() showUsers: boolean = false;
  @Input() allChecked: boolean;
  @Input() orderedBy: string;

  @Output() editarDato:EventEmitter<Object> = new EventEmitter();
  @Output() sendUser:EventEmitter<Object> = new EventEmitter();
  @Output() changePage:EventEmitter<Object> = new EventEmitter();
  @Output() changeLimit:EventEmitter<Object> = new EventEmitter();
  @Output() changeOrderedBy:EventEmitter<string> = new EventEmitter();
  @Output() changeToDemo:EventEmitter<any> = new EventEmitter();
  @Output() terminar:EventEmitter<number> = new EventEmitter();
  @Output() sendSelecteds: EventEmitter<Array<Object>> = new EventEmitter();
  @Output() sendDrop: EventEmitter<Array<Object>> = new EventEmitter();
  @Output() openNew: EventEmitter<any> = new EventEmitter();
  @Output() showSuperuserEvent: EventEmitter<any> = new EventEmitter();
  @Output() clickColumnButtonEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectCurvaEmitter:EventEmitter<any> = new EventEmitter();

  columns: string[] = [];
  previous_title: string = '';
  limit: number;
  objects: number;
  totalPages: number;
  @Input() loading: boolean = false;
  warningFunction: Function;
  dangerFunction: Function;
  warningTitle: string;
  dangerTitle: string;

  rowsSelected: Object[] = [];
  columnNamePipe: ColumnNamePipe = new ColumnNamePipe();
  buttonsColumn: botonesTabla[] = [];

  isButtonPipe: IsButtonTable = new IsButtonTable();
  IsStatusColumnTable: IsStatusColumnTable = new IsStatusColumnTable();
  columnsNoChangeOrder = columnsNoChangeOrder;
  borrarTodoIds = [];

  categoryTitle;
  nextTitle;

  botonesTablaEnum = botonesTabla;
  loadingCurvas: boolean;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private store: Store<AppState>,
    private commonService: CommonService
  , public dialog: MatDialog) { }

  ngOnInit(): void {
    if(!this.orderedBy) this.orderedBy = '';
    this.store.select(getLoading)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.loading = value;
      }
    )
    let obj = Object.entries(categories).filter(([key, value]) => (typeof value === 'number') && key.toLocaleLowerCase() === this.title.toLocaleLowerCase());
    this.categoryTitle = (obj && obj.length > 0) ? obj[0][1] : -1;
    if(this.categoryTitle && this.categoryTitle !== -1) {
      let titles = Object.entries(categories).filter(([key, value]) => typeof value === 'number' && value === this.categoryTitle + 1);
      this.nextTitle = ((titles && titles.length > 0) ? titles[0][0].toLocaleLowerCase() : -1)
    }
  }

  ngOnChanges() {
    //if(this.previous_title !== this.title) this.orderedBy = '';
    this.previous_title = this.title;
    this.rowsSelected = [];
    this.initData();
  }

  initData() {
    if(this.data) {
      (this.title=='curvas') ? this.datos = this.data.datos : this.datos = (this.datos) ? this.datos : this.data.datos;
      this.limit = this.data.limit;
      this.objects = this.data.objects;
      this.totalPages = this.data.total_pages;
    } else {
      this.datos = (!this.datos) ? [] : this.datos;
      this.limit = 0;
      this.objects = (!this.datos) ? 0 : this.datos.length;
      this.totalPages = (!this.datos) ? 0 : 1;
    }
    this.columns = (this.datos && this.datos.length > 0) ? columnsTable[this.title.toLowerCase()].filter(element => !element.includes('__')) : [];
    // hay función warning
    if(this.warning) {
      let [ title, f ] = this.warning;
      if(f) {
        this.warningTitle = title;
        this.warningFunction = f;
      } else {
        this.warningTitle = undefined;
        this.warningFunction = undefined;
      }
    }
    // hay función danger
    if(this.danger) {
      let [ title, f ] = this.danger;
      if(f) {
        this.dangerTitle = title;
        this.dangerFunction = f;
      } else {
        this.dangerTitle = undefined;
        this.dangerFunction = undefined;
      }
    }
    // filtrar botones que son de la columna acciones
    this.buttonsColumn = this.buttons?.filter(e => ![botonesTabla.crear, botonesTabla.superuser].includes(e));
  }

  showSuperUser() {
    this.showSuperuserEvent.emit();
  }

  /**
   * Lanza la acción de recargar los clientes
   */
   comeBackClients() {
    if(this.showUsers) this.store.dispatch(setShowUsers({ showUsers: false }));
  }

  /**
   * Función que emite el evento de cambio de página
   * @param event página a la que se va a cambiar
   */
  cambiarPagina(event) {
    this.changePage.emit(event);
  }

  /**
   * Función que emite el evento de cambio de página
   * @param event página a la que se va a cambiar
   */
   sendObjectDrop(event) {
    this.sendDrop.emit(event);
  }

  /**
   * Función que emite el evento de cambiar límite de paginación
   * @param event límite al que se cambia
   */
  cambiarLimit(event) {
    this.changeLimit.emit(event);
  }

  /**
   * Función que emite el evento de edición de una fila
   * @param event datos de la fila
   */
  editRow(event) {
    let row;
    if(event.path) {
      row = parseInt(event.path.find(element => element.id.includes('rowEdit')).id.split('-')[1]);
    } else {
      let target = (event.target) ? event.target : event.srcElement;
      if(event.target.id.includes('rowEdit')) row = target.id.split('-')[1];
      else row = target.parentNode.id.split('-')[1];
    }

    this.editarDato.emit((this.data) ? this.data.datos[row] : this.datos[row]);
  }

  /**
   * Funcion que abre diálogo para mostrar texto
   * @param column columna que titula
   * @param text texto a mostrar
   */
  showText(column: string, text: string) {
    Swal.fire({
      icon: 'info',
      title: this.columnNamePipe.transform(column),
      text: text
    })
  }

  convertToDemo(event){
    var title, text;
    let row;

    if(event.path) {
      row = parseInt(event.path.find(element => element.id.includes('rowConvetir')).id.split('-')[1]);
    } else {
      let target = (event.target) ? event.target : event.srcElement;
      if(event.target.id.includes('rowConvetir')) row = target.id.split('-')[1];
      else row = target.parentNode.id.split('-')[1];
    }

    var data = this.data.datos[row];

    if(this.title == 'Leads'){
      title = `¿Quieres convertir a demo ${(!data['fk_cliente']['verificado']) ? ' y verificar el usuario' : ''}?`
      text = 'Si lo haces no hay vuelta atrás.'
    }else if(this.title == 'Bajas'){
      title = `¿Quieres reconvertir a cliente?`
      text = 'El cliente podrá acceder de nuevo a la plataforma con los datos que tenía cuando se dio de baja.'
    }
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        /* var category = {["category"]:2};

        let row;
        if(event.path) {
          row = parseInt(event.path.find(element => element.id.includes('rowConvetir')).id.split('-')[1]);
        } else {
          let target = (event.target) ? event.target : event.srcElement;
          if(event.target.id.includes('rowConvetir')) row = target.id.split('-')[1];
          else row = target.parentNode.id.split('-')[1];
        } */

        var category = 2

        if(this.title=='Bajas'){
          category = 3
          data = {fk_cliente: data, id: null}
        }

        this.store.dispatch(loadSuperusers({ id: data['fk_cliente']['id'] }));

        this.changeToDemo.emit({object: data, category: category});
      }
    })
  }

  /**
   * Función que emite el evento de visualizar los usuarios de un cliente
   * @param event datos de la fila
   */
  senClient(event) {
    let row;
    if(event.path) {
      row = parseInt(event.path.find(element => element.id.includes('user')).id.split('-')[1]);
    } else {
      let target = (event.target) ? event.target : event.srcElement;
      if(event.target.id.includes('user')) row = target.id.split('-')[1];
      else row = target.parentNode.id.split('-')[1];
    }
    this.sendUser.emit(this.datos[row]);
  }

  /**
   * Función que determina el nuevo filtro por orden de la columna (ascendente o descendente)
   * @param column columna en la que se aplica el filtro
   */
  changeOrder(column) {
    if(!this.isButtonPipe.transform(this.datos[0][column.replace('-', '')]) && !this.IsStatusColumnTable.transform(this.datos[0][column.replace('-', '')])) {
      if(this.orderedBy.includes(column) && !this.orderedBy.includes('-')) column = '-' + column;
      this.orderedBy = column;
      this.changeOrderedBy.emit(column);
    }
  }

  selectCurva(event, element){
    if(element.length==0){
      var newCurvas: any[] = Object.assign([], this.datos)
      if(event.target.checked){
        element = newCurvas
      }else{
        for (let i = 0; i < this.datos.length; i++) {
          const checkbox = document.getElementById(
            `checkbox-${this.datos[i]['id']}`,
          ) as HTMLInputElement | null;
          if(checkbox) checkbox.checked = false;
        }
        element = newCurvas
      }
    }else{
      element = [element]
    }
    // Si aqui se manda un array vacío (como pasa al deseleccionar todas), se borran todas las seleccionadas de todas las páginas.
    this.selectCurvaEmitter.emit({checked: event.target.checked, curva: element});
  }

  /**
   * Función que emite el evento de terminar
   * @param area celda seleccionada
   */
  terminarArea(area) {
    this.terminar.emit(area.id);
  }

  /**
   * Añade o elimina del array según esté seleccionado o no
   * @param event
   */
  changeRowsSelected(event, value: Object) {
    // comprobar que existen los elementos html
    if(event.target) {
      var checked = event.target.checked;
    } else if(event.srcElement) {
      var checked = event.srcElement.checked;
    }

    if(checked !== undefined) {
      // añadimos si se checkea, eliminamos si no
      this.rowsSelected = (checked) ?
      this.rowsSelected.concat(value) :
      this.rowsSelected.filter(element => element['id'] !== value['id']);
    }
  }

  /**
   * Enviar al componente padre las filas seleccionadas
   */
  sendRowsSelected() {
    this.sendSelecteds.emit(this.rowsSelected);
  }

  /**
   * Emits event when clicks in button table
   * @param event
   */
  clickColumnButton(event) {
    this.clickColumnButtonEvent.emit(event);
  }

  /**
   * Función que muestra ventana con imagen
   * @param url de la imagen
   */
  viewImage(url: string) {
    Swal.fire({
      html: `<div>
      <img style="box-shadow: 0 0 10px rgb(245, 245, 245); border-radius: 4px;" height="200"
      src="${'data:image/*;base64,' + url}">
      </div>`
    })
  }

  /**
   * Copy text message to clipboard
   * @param message
   */
  copyClipBoard(message: string) {
    this.commonService.copyTextToClipboard(message);
  }

  /**
   * Función que muestra ventana con video
   * @param url del video
   */
  viewVideo(url: string) {
    const embed = 'http://www.youtube.com/embed/';
    const partsUrl = (url.includes('v=')) ? url.split('v=') : url.split('/');
    const finalUrl = (url.includes('youtu')) ? embed + partsUrl[partsUrl.length - 1] : url;
    Swal.fire({
      html: `<div>
      <iframe height="300" width="400" allowfullscreen
      src="${finalUrl}"></iframe>
      <div>Url: ${url}</div>
      </div>`
    })
  }

  /**
   * Emite evento de abrir ventada de crear o editar datos
   * @param element datos del objeto a editar (opcional)
   */
  openNewWindow(element?: Object) {
    this.openNew.emit(element);
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  /** DESTROY */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.dialog.closeAll();
  }
}
