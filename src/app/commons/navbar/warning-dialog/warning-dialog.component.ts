import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

export interface NotProccessingClient {
  id: number;
  workspace: string;
  type_client: string;
  server_ip: number;
  areas: Array<NotProccessingArea>;
  position: number;
  nombre: string;
  isExpanded: boolean;
  areasSelected: number;
}

export interface NotProccessingArea {
  name: string
  id: number
  cliente: Object
  position: number
  checked: boolean
  add: boolean
  terminado: boolean
  fin_actualizacion: string
  bbox: any
  bounding_box: any
  epsg_proj: any
  epsg_code: any
  superficie: number
}

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WarningDialog implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject();

  // TABLE
  columnsToDisplay = ['select','id', 'workspace', 'nombre', 'fin_actualizacion', 'ha_contrat_sent', 'areasTotal', 'areasAvailable', 'areasSelected'];
  columnsToDisplayAreas = ['select','id','nombre','bounding_box','fin_actualizacion','superficie','terminado'];
  clients: Array<NotProccessingClient> | null;
  areas: Array<NotProccessingArea> | null;
  selection = new SelectionModel<NotProccessingClient>(true, []);
  selectionAreas = new SelectionModel<NotProccessingArea>(true, []);
  dataSource = new MatTableDataSource<NotProccessingClient>(this.data.clients);
  dataSourceAreas = new MatTableDataSource<NotProccessingArea>(this.data.clients);
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<WarningDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.clients = [];
    this.areas = this.data.areas;
    this.setAreas();
    /** We take the areas and restart them */
  }

  /** Here the clients and their areas are built to show in the table */
  setAreas(){
    let areasAux = [];
    this.areas.map((area,index)=>{
      areasAux.push({ ...area,checked:false,position:index });
    })
    this.areas = areasAux;
    let clientsAux2 = [];
    this.clients.map((value)=>{clientsAux2.push(value)});
    this.areas.map((area)=>{
      let aux = false;
      this.clients.map((client)=>{
        if(client.id==area.cliente['id']){
          aux = true;
        }
      });
      if(aux==false){ clientsAux2.push({
        id: area.cliente['id'],
        workspace: area.cliente['workspace'],
        type_client: '',
        server_ip: null,
        areas: [],
        position: clientsAux2.length-1,
        nombre: area.cliente['nombre'],
        isExpanded:false,
        areasSelected: 0,
        fin_actualizacion: area.cliente['fin_actualizacion'],
        ha_contrat_sent: area.cliente['ha_contrat_sent'],
      });}
      this.clients = clientsAux2;
    })
    let clientsAux = []
    this.clients.map((client,index)=>{
      clientsAux.push({ ...client,areas:[],position:index,isExpanded:false,areasSelected:0 });
    });
    this.clients = clientsAux;
    this.clients.map(client=>this.areas.map(area=>{if(area.cliente['id']==client.id) client.areas.push(area)}));
    this.clients.forEach(element => {
      element['areasAvailable'] = element.areas.filter(obj=>{return obj.add}).length;
      element['areasTotal'] = element.areas.filter(obj=>{return obj}).length;
    });
    this.clients.sort((a, b) => (a['areasAvailable'] > b['areasAvailable']) ? -1 : 1)
    this.dataSource = new MatTableDataSource<NotProccessingClient>(this.clients);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.clients.map((client)=>{
        this.checkearAreas(client,false);
      })
      this.selection.clear();
      return;
    }else{
      this.clients.map((client)=>{
        this.checkearAreas(client,true);
      })
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: NotProccessingClient): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Function that launches the actions to process the clients (that are in Mongo) and the areas */
  procesar(){
    this.loading = true;
    // Clear interface
    this.selection.clear();
    let auxClients = [];
    this.clients.map(value=>{
      let auxAreas = [];
      value.areas.map(area=>{auxAreas.push({ ...area,checked:false});});
      auxClients.push({ ...value,areas:auxAreas});
    });
    this.clients = auxClients;
  }

  /**
   * Actions that are carried out when the check of an area is activated or you want to activate/deactivate the check of all areas
   * @param area area to check
   * @param force optional variable indicating if all client areas should be checked/unchecked
   */
  onCheckboxChangeAreas(area: NotProccessingArea, force?:boolean){
    if(area.add){
      this.clients.map((client,index)=>{
        let allChecked = true;
        let areasSelectedNow = 0;
        let areasAvailable = [];
        client.areas.map((value)=>{if(value.add==true){areasAvailable.push(value)}});
        areasAvailable.map((value,index)=>{
          if(value.id==area.id){force==true || force==false ? value.checked=force : value.checked = !area.checked;}
          if(value.checked == false){allChecked = false;}else{areasSelectedNow++;}
        })
        client.areasSelected = areasSelectedNow;
        if(allChecked == true && areasAvailable.length > 0){
          this.selection.toggle(client);
          this.selection.select(client);
        }
      });
    }
  }

  /** Check areas of a client */
  checkearAreas(row:any,selected:boolean){
    row.areas.map((area:any)=>{
      selected==true ? this.onCheckboxChangeAreas(area, true) : this.onCheckboxChangeAreas(area, false);
    });
  }

  // Areas tables
  isAllSelectedAreas() {
    const numSelected = this.selectionAreas.selected.length;
    const numRows = this.dataSourceAreas.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleAreas() {
    if (this.isAllSelected()) {
      this.selectionAreas.clear();
      return;
    }

    this.selectionAreas.select(...this.dataSourceAreas.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelAreas(row?: NotProccessingArea): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionAreas.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** DESTROY */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
