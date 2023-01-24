import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurvesSelection } from 'src/app/interfaces/altas/curves.interface';
import { Area } from 'src/app/interfaces/area';
import { CurvasService } from 'src/app/services/curvas.service';
import { AppState } from 'src/app/store/app.state';
import Swal from 'sweetalert2';
import { checkProcessCurve, acceptComparedCurves, deleteAllOptimCurves, deleteProcessCurves, discardComparedCurves, loadFiltersSucces, loadGenerarCurvasUniques, loadOptimCurves, loadProcessCurves, loadProcesses, resetGenerarCurvasState, generarCurvasLoading, loadProcessCurvesSuccess, saveCurves, createTemporalProcess, deleteTemporalProcess, loadGenerarCurvasOptionsUniques, discardNoComparedCurves, acceptNoComparedCurves, getCurvesToCompare, setStateGeneratedCurves, reprocessDbCurve } from './state/generar-curvas.actions';
import { getGenerarCurvasLoading, getLoadingProcessesFilter, getOptimCurves, getProcessCurves, getProcessCurvesChecked, getProcesses, getProcessFilters, getProcessFiltersOptions, getTotalCompareCurves } from './state/generar-curvas.selector';
import { Process, processFilter } from './state/generar-curvas.state';
import { ColumnFiltersCurvesPipe } from 'src/app/pipes/columnFiltersCurves.pipe';
import { clearRequest } from 'src/app/services/clearRequest.service';
import { GenerarCurvasCompareOptions } from '../../enums/GenerarCurvas.enum';
import { CommonService } from 'src/app/services/Common.service';

const INTERVAL_STATUS = 3000
const LIMIT_OPTIM_CURVES = 6

@Component({
  selector: 'app-generar-curvas',
  templateUrl: './generar-curvas.component.html',
  styleUrls: ['./generar-curvas.component.scss'],
  providers: [
    ColumnFiltersCurvesPipe
  ],
})
export class GenerarCurvasComponent implements OnInit {

  /** Filters */
  actualFilter: Object = {};
  process_filters: processFilter = null
  displayOptions: boolean = false;
  displayProcessOptions: boolean = false;

  /** Processes */
  curves_selection: string = CurvesSelection.BBDD;
  processes: Process[] = null

  /** Curves */
  process_curves: any = null
  optim_curves: any = null
  curvas:any = null
  process_curves_checked: string[] = []

  messageStatusProcess: { message: string, status: string } | null = null;

  /** Pagination */
  page: number = 1

  processFilterInput: Object = {};

  private ngUnsubscribe: Subject<any> = new Subject();

  area:Area;
  compareState:boolean = false;
  compareTemporaryCurve:any = null;
  compareBDCurve:any = null;

  CurvesSelection = CurvesSelection;
  selectedProcess: { name: string, id: string, celery_id: string } = null;

  correctFiltersValuesBBDD:Array<any> = [];
  correctFiltersValuesTemporales:Array<any> = [];
  loadingProcessesFilters: Observable<boolean> = of(false);
  loading_curves: boolean = false;
  messageLoading: string | null = null;
  compare_total_curves: Observable<number> = null
  page_compared: number = 0;
  onLoad: boolean = true;

  reloadCurves: boolean = false;

  GenerarCurvasCompareOptions = GenerarCurvasCompareOptions;
  displayCompareSelect: boolean = false;
  optionsCompareSelect: Object;
  optionsCompareSelected: string = GenerarCurvasCompareOptions.SELECCIONADAS.valueOf();

  changeToTemporals:boolean = false;
  statusProcessInterval = null;
  infoCurvesChecked: Object[] = [];

  constructor(
    public store: Store<AppState>,
    private curvaService: CurvasService,
    @Inject(MAT_DIALOG_DATA) public dataInput,
    public dialogRef: MatDialogRef<GenerarCurvasComponent>,
    private columnFiltersCurve: ColumnFiltersCurvesPipe,
    private clearRequestService: clearRequest,
    private commonService: CommonService,
  ) {
    this.area = dataInput.areaSelected;
  }

  ngOnInit(): void {
    this.optionsCompareSelect = Object.entries(GenerarCurvasCompareOptions)
    .reduce((acc, e) => {
      let [ key, value ] = e;
      return { ...acc, [key]: value }
    }, {});

    this.listenClickAllComponent();

    this.initializeListeners();

    this.initializeProcessFilters();

  }


  /** INITIALIZATION */
  /**
   * Main initialization function
   */
  initializeListeners(){

    //filters
    this.filterConfiguration()

    /** Curvas base de datos */
    this.getOptimCurves()

    /** Pedir procesos */
    this.getProcesses()

    //Curvas temporales
    this.getProcessCurves()

    this.store.select(getGenerarCurvasLoading)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(({ value, info }) => {
      this.loading_curves = value;
      this.messageLoading = info;
    });

    this.curvaService.getSelectedProcess()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(process => {
      this.selectedProcess = process;
      this.changeCurvesSelection(CurvesSelection.TEMPORALES);
    })

  }

  /** Obtención de procesos y curvas */

  /**
   * Function to obtain the process of an area
   */
  getProcesses(){
    this.store.select(getProcesses)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(async (value) => {
      if(value){
        this.processes = value;
        if(!this.onLoad) {
          if(this.processes?.length) {
            if(this.changeToTemporals){
              this.changeToTemporals = false;
            } else {
              if(this.selectedProcess && this.processes.every(e => e.id !== this.selectedProcess.id)){
                Swal.fire({
                  icon: 'info',
                  title: `El proceso ${(this.selectedProcess) ? this.selectedProcess.name : ''} se ha eliminado`,
                  text: 'El proceso ya no tiene ninguna curva'
                });
              }
            }
            await this.selectProcess(
              (!this.selectedProcess || this.processes.every(e => e.id !== this.selectedProcess.id)) ?
              this.processes[0] :
              this.selectedProcess
            );
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No hay procesos'
            });
            this.changeCurvesSelection(CurvesSelection.BBDD)
          }
        } else {
          this.onLoad = false;
        }
      }
    })
  }

  /**
   * Function to obtain curves of a temporal process
   */
  getProcessCurves(){
    this.store.select(getProcessCurves)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.process_curves = value
      this.curvas = value

      if(this.curvas){
        let checking: number = 0;
        for (let i = 0; i < this.curvas.datos.length; i++) {
          if(this.curvas.datos[i].compare){
            checking += 1
          }
        }
        this.page_compared=checking
      }
    })

    this.store.select(getProcessCurvesChecked)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.process_curves_checked = value;
      if(this.curvas?.datos?.length) {
        this.infoCurvesChecked = this.infoCurvesChecked.concat(this.curvas.datos);
        this.infoCurvesChecked = this.infoCurvesChecked.filter((el, index, array) => this.process_curves_checked.includes(el['id']) && array.findIndex(e => e === el) === index)
      }
    })

    this.compare_total_curves = this.store.select(getTotalCompareCurves)

  }

  /**
   * Function to obtain BBDD curves of an area
   */
  getOptimCurves(){
    this.store.select(getOptimCurves)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.optim_curves = value
      this.curvas = value
    })
  }

  initializeProcessFilters(){
    /** Guardar las opciones de areas */
    let filters: any = this.curvaService.buildFilters(this.process_filters,[{attribute: 'areas', values: this.dataInput.areas}])
    this.store.dispatch(loadFiltersSucces({filters: filters,tipo: 1}))

    /** Obtener los uniques del resto de atributos */
    this.store.dispatch(loadGenerarCurvasUniques({areas: this.dataInput.areas.map(obj => obj.id)}))

    /** Pedir curvas optimas */
    this.store.dispatch(loadOptimCurves({area: [this.area.id], page: 1, limit: LIMIT_OPTIM_CURVES, filters: this.actualFilter}))

  }

  /** Filter configuration initialization */
  filterConfiguration(){
    this.loadingProcessesFilters = this.store.select(getLoadingProcessesFilter);
    /** Filters */
    this.store.select(getProcessFilters)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(data => {
      this.process_filters = JSON.parse(JSON.stringify(data));

      if(data) {
        this.process_filters = this.curvaService.getProcessesWithoutNull(this.process_filters);
        // send possibles filter values
        this.correctFiltersValuesTemporales = this.curvaService.getCorrectFiltersValues(this.process_filters);

        // create new process filter input
        this.processFilterInput = this.curvaService.getProcessFilterInput(
        JSON.parse(JSON.stringify(this.process_filters)),
        JSON.parse(JSON.stringify(this.processFilterInput)),
        {
          areas: [ this.area.id ],
          producto: ['agua','lai','clorofila','ndvi'],
          //algoritmo: 'david',
          tipo: 'fs'
        });
      }
    })

    this.store.dispatch(loadGenerarCurvasOptionsUniques({areas: this.dataInput.areas.map(obj => {return obj.id}), filters: this.actualFilter}));

    this.store.select(getProcessFiltersOptions)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      if(value){
        let auxFilters = this.curvaService.getProcessesWithoutNull(value);
        // send possibles filter values
        this.correctFiltersValuesBBDD = this.curvaService.getCorrectFiltersValues(auxFilters);
      }
    })
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



  /** EVENTS */

  /**
   * Listen to new filter event in filter curves component
   * @param newFilter
   */
  changeFilter(newFilter: Object, load: boolean = true): void {
    this.page = 1;
    this.actualFilter = JSON.parse(JSON.stringify(newFilter));
    this.store.dispatch(checkProcessCurve({id: null}));
    if(load) {
      if(this.curves_selection === CurvesSelection.BBDD) {
        this.store.dispatch(loadOptimCurves({area: [this.area.id], page: 1, limit: LIMIT_OPTIM_CURVES, filters: this.actualFilter}));
      } else {
        this.selectedProcess && this.store.dispatch(loadProcessCurves({area: this.area.id, process: this.selectedProcess.id, page: 1, limit: LIMIT_OPTIM_CURVES, filters: this.actualFilter}));
        this.selectedProcess && this.store.dispatch(getCurvesToCompare({ process: this.selectedProcess.id, filters: this.actualFilter }));
      }
    }
  }

  /**
   * Method that changes curves selection (bbdd or 'temporales')
   * @param new_selection new selection string
   */
  changeCurvesSelection(new_selection: string): void {
    this.curves_selection = new_selection;
    this.page = 1;
    //this.store.dispatch(generarCurvasLoading({value: true}))
    this.store.dispatch(setStateGeneratedCurves({key: 'compare_total_curves', value: null}))
    this.clearInterval();
    this.infoCurvesChecked = [];

    if(this.curves_selection === CurvesSelection.BBDD) {
      /** clear pending requests */
      this.clearRequestService.cancelPendingRequestsCurves();
      this.changeFilter({});
      this.store.dispatch(loadGenerarCurvasOptionsUniques({areas: this.dataInput.areas.map(obj => obj.id), filters: this.actualFilter}));
      this.curvas = this.optim_curves
      if(!this.process_curves) this.selectedProcess = null;
    } else {
      /** clear pending requests */
      this.clearRequestService.cancelPendingRequestsCurves();
      this.changeFilter({}, false);
      this.store.dispatch(loadProcesses({area: this.area.id, filtros: this.actualFilter}));
      this.curvas = this.process_curves;
      this.changeToTemporals = true;
    }
  }

  /**
   * Method that changes process select options visibility
   */
  changeVisibilityProcesses() {
    this.displayProcessOptions = !this.displayProcessOptions;
  }

  deleteTemporalProcess(processId: string) {
    this.selectedProcess = null;
    this.store.dispatch(deleteTemporalProcess({ processId: processId, area_id: this.area.id }))
  }

  /**
   * Method to change selected process
   * @param process new process selected
   */
  async selectProcess(process, activateLoading: boolean = true) {
    /** clear pending requests */
    this.clearInterval();
    this.clearRequestService.cancelPendingRequestsCurves()

    // ask for state process
    activateLoading && this.store.dispatch(generarCurvasLoading({value: true}))
    this.store.dispatch(loadProcessCurvesSuccess({processCurves: null}))
    this.store.dispatch(setStateGeneratedCurves({key: 'compare_total_curves', value: null}))
    this.selectedProcess = { ...process };
    //this.changeVisibilityProcesses();

    await this.curvaService.infoTaskTemporalProcess(this.selectedProcess.celery_id)
    .then(e => {
      const status = e['state'];
      switch(status) {
        case 'SUCCESS': {
          this.clearInterval();
          // if is sucess !!!!
          if(e['result'] && e['result'] !== 'None') {
            Swal.fire({
              icon: 'info',
              title: 'Info',
              text: e['result']
            });
          }
          this.messageStatusProcess = null;
          this.page = 1;
          this.store.dispatch(generarCurvasLoading({value: true}))
          this.store.dispatch(getCurvesToCompare({process: process.id, filters: this.actualFilter }));
          this.store.dispatch(checkProcessCurve({id: null}))
          /** Pedir curvas de un proceso */
          this.store.dispatch(loadProcessCurves({area: this.area.id, process: this.selectedProcess.id, page: 1, limit: LIMIT_OPTIM_CURVES, filters: this.actualFilter}))
          break;
        }
        case 'FAILURE': {
          this.clearInterval();
          let exception = e['exception']
          if(exception) {
            let a = /(["'])(.*?)\1/g.exec(exception);
            if(a.length) exception = a[0];
          }
          this.messageStatusProcess = {
            message: exception || 'Error al crear las curvas. Cree un nuevo proceso.',
            status: status
          };
          this.store.dispatch(generarCurvasLoading({value: false}))
          break;
        }

        default: {
          this.messageStatusProcess = {
            message: 'Se están generando las curvas.',
            status: status
          };
          this.store.dispatch(generarCurvasLoading({value: false}));
          if(!this.statusProcessInterval) this.statusProcessInterval = setInterval(() => this.selectProcess(process, false), INTERVAL_STATUS);
          break;
        }
      }
    })
    .catch((error) => {
      this.clearInterval();
      if(error?.status === 0) {
        this.messageStatusProcess = {
          message: 'Error al obtener el estado del proceso. Vuelva a intentarlo.',
          status: 'OTHER'
        };
      } else if(error?.status === 404) {
        this.messageStatusProcess = {
          message: 'No se pudo obtener el estado del proceso. Vuelva a intentarlo.',
          status: 'OTHER'
        };
      } else {
        this.messageStatusProcess = {
          message: 'Error inesperado. Vuelva a intentarlo.',
          status: 'OTHER'
        };
      }
      this.store.dispatch(generarCurvasLoading({value: false}))
    })
  }

  /**
   * Clear interval to search about info process
   */
  clearInterval() {
    if(this.statusProcessInterval) clearInterval(this.statusProcessInterval);
    this.statusProcessInterval = null;
  }

  /**
   * Method to listen click event at component to close processes select options
   */
  listenClickAllComponent() {
    let mainComponent = document.getElementById('main-generated-curves');
    mainComponent && mainComponent.addEventListener('click', (evt) => {
      if(this.displayProcessOptions) {
        this.displayProcessOptions = !this.displayProcessOptions;
      }

      if(this.displayOptions) {
        this.displayOptions = !this.displayOptions;
      }

      if(this.displayCompareSelect) {
        this.displayCompareSelect = !this.displayCompareSelect;
      }
    })
  }

  /**
   * Function to change the pagination page and request the new page curves
   * @param page new page to make the request
   */
  cambiarPagina(page: number){
    this.page = page;
    this.store.dispatch(generarCurvasLoading({value: true}));

    (this.curves_selection === CurvesSelection.BBDD) ?
    this.store.dispatch(loadOptimCurves({area: [this.area.id], page: this.page, limit: LIMIT_OPTIM_CURVES, filters: this.actualFilter})) :
    this.store.dispatch(loadProcessCurves({area: this.area.id, process: this.selectedProcess.id, page: this.page, limit: LIMIT_OPTIM_CURVES, filters: this.actualFilter}));
  }

  /** CURVE EVENTS */
  /** temporal curves */
  /**
   * Function to select all the checks in curves
   */
  selectAll() {
    if(this.process_curves.datos.length < LIMIT_OPTIM_CURVES) {
      let process_curves_ids: any[] = this.process_curves.datos.filter(obj => !obj.compare).map(obj2 => obj2.id)

      let curves_aux: any = process_curves_ids.filter((value: any) => !this.process_curves_checked.includes(value))

      if(curves_aux?.length === 0){
        curves_aux = process_curves_ids
      }

      this.store.dispatch(checkProcessCurve({ id: curves_aux }))
    }
  }

  /**
   * Reprocess all selected curves from db
   */
  reprocessDbCurves() {
    this.store.dispatch(reprocessDbCurve({ areaId: this.area.id, curves: this.infoCurvesChecked }))
  }

  /**
   * Function to unselect all the checks in curves
   */
  unselectAll() {
    this.infoCurvesChecked = [];
    this.store.dispatch(checkProcessCurve({ id: null }));
  }

  /**
   * Function to accept temporal process curves checked
   */
  acceptCurves(){
    this.selectedProcess && this.store.dispatch(saveCurves({area: this.area.id, process: this.selectedProcess, ids: this.process_curves_checked, compare: false, filters: this.actualFilter}))
    this.page = 1;
  }

  /**
   * Function to discard temporal process curves checked
   */
  discardCurves(){
    this.store.dispatch(generarCurvasLoading({value: true}));
    this.store.dispatch(deleteProcessCurves({area: this.area.id, process: this.selectedProcess, ids: null, compare: false, filters: this.actualFilter}))
    this.page = 1;
  }

  /** bbdd curves */
  /**
   * Function to delete all BBDD curves of an area
   */
  deleteAll(){
    /** Esto dependerá de la seleccion del toggle */
    if(this.curves_selection == CurvesSelection.BBDD){
      Swal.fire({
        title: `¿Estás seguro de que quieres eliminar todas las curvas ${JSON.stringify(this.actualFilter)=='{}'?' ':' filtradas '}de este área?`,
        text: "Esta opción no se podrá revertir. Las curvas óptimas no aparecerán en la herramienta de la plataforma y los productos que dependen de ellas se dejarán de actualizar.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        width: '400px'
      }).then((result) => {
        if (result.isConfirmed) {
          this.page = 1;
          this.store.dispatch(deleteAllOptimCurves({area: this.area.id, filtros: this.actualFilter}))
        }
      })
    }
  }

  /** compare */
  /**
   * Function to discard all temporal process curves that have a comparation
   */
  discardAllCompared(){
    Swal.fire({
      title: `¿Estás seguro de que quieres eliminar todas las curvas temporales ${JSON.stringify(this.actualFilter)=='{}'?' ':' filtradas '} de este proceso pendientes de comparación?`,
      text: "Esta opción no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      width: '400px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.page = 1;
        this.store.dispatch(generarCurvasLoading({value: true}));
        this.selectedProcess &&
        this.store.dispatch(discardComparedCurves({area: this.area.id, process: this.selectedProcess.id, filters: this.actualFilter}));
      }
    })

  }

  /**
   * Function to accept all temporal process curves that have a comparation
   */
  acceptAllCompared(){
    Swal.fire({
      title: `¿Estás seguro de que quieres guardar en BBDD todas las curvas temporales ${JSON.stringify(this.actualFilter)=='{}'?' ':' filtradas '} de este proceso pendientes de comparación?`,
      text: "Sus curvas correspondientes en BBDD serán sustituidas por estas nuevas curvas temporales. Esta opción no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      width: '400px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.page = 1;
        this.store.dispatch(generarCurvasLoading({value: true}));
        this.selectedProcess &&
        this.store.dispatch(acceptComparedCurves({area: this.area.id, process: this.selectedProcess, filters: this.actualFilter}));
      }
    })
  }

  /** compare */
  /**
   * Function to discard all temporal process curves that do not have a comparation
   */
  discardAllNoCompared(){
    Swal.fire({
      title: `¿Estás seguro de que quieres eliminar todas las curvas temporales ${JSON.stringify(this.actualFilter)=='{}'?' ':' filtradas '} de este proceso sin comparación pendiente?`,
      text: "Esta opción no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      width: '400px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.page = 1;
        this.store.dispatch(generarCurvasLoading({value: true}));
        this.selectedProcess &&
        this.store.dispatch(discardNoComparedCurves({area: this.area.id, process: this.selectedProcess.id, filters: this.actualFilter}));
      }
    })
  }

  /**
   * Function to accept all temporal process curves that do not have a comparation
   */
  acceptAllNoCompared(){
    Swal.fire({
      title: `¿Estás seguro de que quieres guardar en BBDD todas las curvas temporales ${JSON.stringify(this.actualFilter)=='{}'?' ':' filtradas '} de este proceso sin comparación pendiente?`,
      text: "Esta opción no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      width: '400px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.page = 1;
        this.store.dispatch(generarCurvasLoading({value: true}));
        this.store.dispatch(acceptNoComparedCurves({area: this.area.id, process: this.selectedProcess, filters: this.actualFilter}));
      }
    })
  }

  /**
   * Function to discard a comparation (delete temporal process curve)
   */
  discardCompared(){
    /** Esto dependerá de la seleccion del toggle */
    this.store.dispatch(deleteProcessCurves({area: this.area.id, process: this.selectedProcess, ids: [this.compareTemporaryCurve.id], compare: true,  filters: this.actualFilter}))
    this.compare([false, null])
    this.page = 1;
  }

  /**
   * Function to accept a comparation (save temporal process curve in to BBDD)
   */
  acceptCompared(){
    this.store.dispatch(saveCurves({area: this.area.id, process: this.selectedProcess, ids: [this.compareTemporaryCurve.id], compare: true, filters: this.actualFilter}))
    this.compare([false, null])
    this.page = 1;
  }

  /**
   * compare event (enable or disable comparation)
   * @param event [boolean, bbdd curve]
   */
  compare(event){
    this.compareState = event[0];
    this.compareTemporaryCurve = event[1];
    event[1] ? this.compareBDCurve = event[1].compare : null;
  }

  /**
   * Function to close compare visualization when deleting a curve inside compare visualization
   */
  closeCompare(){
    this.compare([false, null])
  }

  processCurves(){
    let listHTML = `<p>Los datos con los que se va a reprocesar son los siguientes: </p>`
    Object.entries(this.processFilterInput).forEach(([key, value]) => {
      listHTML += `
        <li style="text-align: left; margin-top: 0.3rem">
          <strong>${this.columnFiltersCurve.transform(value, key, true)}</strong>:
          ${key === 'areas'
            ? this.area.nombre
            : this.columnFiltersCurve.transform(value, key, false)}
        </li>
      `
    })

    Swal.fire({
      title: '¿Estás seguro de que quieres procesar todo?',
      html: listHTML,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Create process with params
        this.store.dispatch(createTemporalProcess({ filters: { ...this.processFilterInput }, area_id: this.area.id }))
      }
    })
  }

  eliminatedCurve(event){
    if(event[0]=="eliminado"){
      this.page = 1;
    }
  }

  acceptClickEvent(selectedValue: string) {


    switch(selectedValue) {
      case GenerarCurvasCompareOptions.SELECCIONADAS: this.acceptCurves(); break;
      case GenerarCurvasCompareOptions.COMPARADAS: this.acceptAllCompared(); break;
      case GenerarCurvasCompareOptions.NO_COMPARADAS: this.acceptAllNoCompared(); break;
      default: break;
    }
  }

  discardClickEvent(selectedValue: string) {
    switch(selectedValue) {
      case GenerarCurvasCompareOptions.SELECCIONADAS: this.discardCurves(); break;
      case GenerarCurvasCompareOptions.COMPARADAS: this.discardAllCompared(); break;
      case GenerarCurvasCompareOptions.NO_COMPARADAS: this.discardAllNoCompared(); break;
      default: break;
    }
  }

  /**
   * Cierra el diálogo
   */
  closeTool(){
    this.dialogRef.close();
  }

  /** CLOSE */
  ngOnDestroy(): void {
    this.clearInterval();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.store.dispatch(resetGenerarCurvasState())
  }
}
