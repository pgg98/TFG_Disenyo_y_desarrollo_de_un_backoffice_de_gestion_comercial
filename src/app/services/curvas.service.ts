import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { deleteAllOptimCurves } from "../commons/table/generar-curvas/state/generar-curvas.actions";
import { processFilter } from "../commons/table/generar-curvas/state/generar-curvas.state";
import { CurvesSelection, OptionsProcessFilter } from "../interfaces/altas/curves.interface";
import { saveAs } from 'file-saver';
import { CommonService } from "./Common.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurvasService {
  private readonly TIPO_KEY_VALUE = { key: 'tipo', value: ['fs', 'fi'] };

  private selectedProcess: Subject<{name: string, id: string, celery_id: string}> = new Subject();

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * Get instance of selected process
   * @returns
   */
  getSelectedProcess(): Subject<{ name: string, id: string, celery_id: string }> {
    return this.selectedProcess;
  }

  /**
   * Load new event to observable
   * @param obj
   */
  nextSelectedProcess(obj: { name: string, id: string, celery_id: string }) {
    this.selectedProcess.next(obj);
  }

  /** FILTERS */
  buildFilters(oldFilter: any, values: any[]){
    let newFilter: any = JSON.parse(JSON.stringify(oldFilter))
    /** Eliminamos las opciones de tipo */
    newFilter.tipo = []

    /** Recorremos todos los valores obtenidos de las peticiones */
    values.forEach(element => {
      if(!['fi', 'fs'].includes(element.attribute)){
        newFilter[element.attribute] = element.values
      }else{
        if(element.values){
          newFilter['tipo'].push(element.attribute)
        }
      }
    });

    return newFilter
  }

  /** FORMAT ENDPOINTS */
  buildUniquesJoin(areas: number[]) {
    let attributes = [ "historicos__variedad", "historicos__zafra", "historicos__soca", "zona_eco", "riego" ]
    let attributesUnlimited = [ "historicos__fs", "historicos__fi" ]
    return [
      ...attributes.map(label => {
        return this.uniques({atributo: label, fk_area__in: areas}).pipe(
          map((x: any)=>{
            let atrLabel = label.split('__');
            return {
              values: (x && x.length) ? x : null,
              attribute: (atrLabel.length > 1) ? atrLabel[1] : atrLabel[0]
            }
          })
        )
      }),
      ...attributesUnlimited.map(label => {
        return this.uniqueslimited({ atributo:[label], filtro: "", limit: 1, fk_area__in: areas }).pipe(
          map((x: any)=>{
            let atrLabel = label.split('__');
            return {
              values: (x && x.length) ? x : null,
              attribute: (atrLabel.length > 1) ? atrLabel[1] : atrLabel[0]
            }
          })
        )
      })
    ]
  }

  /**
   * Build petitions to valoresOptimosUniques and return all responses
   * @param areas
   * @param filtro
   * @returns
   */
  buildUniquesOptionsJoin(areas: number[], filtro: any){
    let attributes = [ 'variedad', 'soca', 'tipo', 'mes', 'producto', 'riego', 'zona_eco' ];

    return attributes.map(label => {
      const params = {
        atributo: (label === 'producto') ? 'fk_producto__nombre' : label,
        areas: areas ? JSON.stringify(areas) : null,
        filtro: filtro ? JSON.stringify(filtro) : null
      }
      return this.uniquesOptions(params).pipe(
        map((x: any)=>{
          return {
            values: (x && x.length) ? x : null,
            attribute: label
          }
        })
      )
    })
  }

  /** ENDPOINTS */
  /** uniques */
  uniques(datos: any) {
    return this.http.post(`${environment.databaseURL}/rest/uniques`, datos, this.httpOptions);
  }

  uniqueslimited(datos: any) {
    return this.http.post(`${environment.databaseURL}/rest/uniqueslimited`, datos, this.httpOptions);
  }

  uniquesOptions(params: Object = {}){
    // Ejemplo /rest/uniques/valoresOptimos?atributo=variedad&areas=[880]&filtro={}
    const url = `/rest/uniques/valoresOptimos`;
    const finalUrl = !Object.keys(params).length ? url : this.commonService.serializeParamsQuery(url, params)
    return this.http.get(`${environment.databaseURL}${finalUrl}`, this.httpOptions);
  }

  /** processes */

  getProcesses(area: number){
    return this.http.get(`${environment.api_process_client_url}/temporal-process/${area}`,this.httpOptions);
  }

  /**
   * Create temporal process that creates new temporal curves
   * @param body data with configrations anda params to create new curves
   * @returns new process created
   */
  createTemporalProcess(body: Object){
    return this.http.post(`${environment.api_process_client_url}/temporal-process`, body, this.httpOptions);
  }

  /**
   * Delete process with selected id
   * @param processId id from process
   * @returns action result
   */
  deleteTemporalProcess(processId: string) {
    return this.http.delete(`${environment.api_process_client_url}/temporal-process/${processId}`);
  }

  /**
   * Reprocess selected curves from db to mongo system
   * @param areaId id from area
   * @returns process created
   */
  reprocessDbCurve(areaId: number, curves: Object[]) {
    return this.http.post(`${environment.api_process_client_url}/temporal-process/curves-bbdd/${areaId}/reprocessing`, curves);
  }

  /** get curves */


  getProcessCurves(process: string, page: number, limit: number, filters: Object = {}){
    const params = {
      page: page,
      limit: limit,
      filter_obj: (Object.keys(filters).length) ? JSON.stringify(filters) : null
    }
    const url = this.commonService.serializeParamsQuery(`/temporal-process/${process}/curves`, params);
    return this.http.get(`${environment.api_process_client_url}${url}`, this.httpOptions)
  }

  /** delete */

  deleteAllOptimCurves(area: number, filtro: Object = {}) {
    const params = (filtro) ? {
      filtro: (Object.keys(filtro)?.length) ? JSON.stringify(filtro) : null
    } : {};
    const url = this.commonService.serializeParamsQuery(`/rest/valores_optimos/area/${area}`, params);
    return this.http.delete(`${environment.databaseURL}${url}`,this.httpOptions);
  }

  deleteSingleOptimCurve(id: number){
    return `Curva ${id} eliminada correctamente`
  }

  deleteAllProcessCurves(process: string) {
    return `Curvas del proceso ${process} eliminadas correctamente`
  }

  deleteProcessCurves(process: string, body: any){
    return this.http.delete(`${environment.api_process_client_url}/temporal-process/${process}/curves?filter=${JSON.stringify(body)}`,this.httpOptions);
  }

  /** reprocess */
  reprocessCurve(curveId: string) {
    return this.http.post(`${environment.api_process_client_url}/temporal-process/curves/${curveId}/reprocessing`, {})
  }

  /** save */
  saveCurves(id_area: number, body: any){
    return this.http.post(`${environment.databaseURL}/rest/valores_optimos/area/${id_area}/upload_temporal`, body, this.httpOptions)
  }

  /** accept compared */
  acceptCompared(id_area: number, body: any){
    return this.http.post(`${environment.databaseURL}/rest/valores_optimos/area/${id_area}/accept_compare_temporal`, body, this.httpOptions)
  }

  /** discard compared */
  discardCompared(id_area: number, body: any){
    return this.http.post(`${environment.databaseURL}/rest/valores_optimos/area/${id_area}/discard_compare_temporal`, body, this.httpOptions)
  }

  /** others */
  getProcessesWithoutNull(processes: processFilter): processFilter {
    return {
      areas: processes?.areas?.filter(e => e !== null),
      producto: processes?.producto?.filter(e => e !== null),
      //algoritmo: processes?.algoritmo?.filter(e => e !== null),
      zafra: processes?.zafra?.filter(e => e !== null),
      variedad: processes?.variedad?.filter(e => e !== null),
      soca: processes?.soca?.filter(e => e !== null),
      mes:  processes?.mes?.filter(e => e !== null),
      zona_eco: processes?.zona_eco?.filter(e => e !== null),
      riego: processes?.riego?.filter(e => e !== null),
      tipo: [ ...this.TIPO_KEY_VALUE.value ]
    }
  }

  getCorrectFiltersValues(processes: processFilter): { key: string, value:any }[] {
    return Object.entries(processes)
    .filter(([key, value]) => !['areas', 'zafra', 'algoritmo'].includes(key) )
    .map(([key, value]) => {
      return {
        key: key,
        value: (value.constructor.name === 'Array') ?
        value.filter(e => e !== null) : value
      }
    });
  }

  getProcessFilterInput(processes: processFilter, prevFilter: Object = {}, options: OptionsProcessFilter): Object {
    for (let propertyProcesses in processes) {
      for (let propertyPrevFilter in prevFilter) {
        if(propertyProcesses==propertyPrevFilter && propertyProcesses!="algoritmo" && propertyProcesses!="areas" && propertyProcesses!="tipo"){
          prevFilter[propertyPrevFilter]=processes[propertyProcesses]
        }
      }
    }

    return Object.entries(processes)
    .reduce((act, [ key, value ]) => {
      return {
        ...act,
        [key]: prevFilter[key] && !['algoritmo', 'tipo'].includes(key) ?
        prevFilter[key].filter(e => value.includes(e) || value.some(area => area?.id === e)) :
        (options[key]) || []
      };
    }, {});
  }

  infoTaskTemporalProcess(celeryId: string): Promise<Object> {
    return this.http.get(`${environment.celeryURL}/api/task/info/${celeryId}`).toPromise()
  }

  downloadErrors(errors:Array<string>){
    let message: string = ``;

    for (let i = 0; i < errors.length; i++) {
      //construimos cabecera del csv
      message += `Curva ${i};` + "\n";
			//resto del contenido
			message += `${errors[i]};` + "\n";
    }

    // crear csv
    var blob = new Blob([message], {type: 'text/csv'});

    saveAs(blob, `detallesErrores.csv`);
  }

  /** FORMATTING */
  /**
   * Format body to curves request
   * @param filter
   * @returns
   */
  formatBodyFilter(filter: Object = {}, type: string): Object {
    return Object.entries(filter)
    .filter(([key, value]) => value?.length)
    .reduce((acc, element) => {
      let [ key, value ] = element;
      return {
        ...acc,
        [`${this.getKeyFilterCurves(key, type)}`]: this.getValuesFilterCurves(key, value, type)
      }
    }, {});
  }

  private getKeyFilterCurves(key: string, type: string): string {
    switch(key) {
      case 'productos': return type == CurvesSelection.BBDD ? 'fk_producto__nombre__in' : 'producto';
      case 'producto': return type == CurvesSelection.BBDD ? 'fk_producto__nombre__in' : 'producto';
      case 'tipo': return type == CurvesSelection.BBDD ? 'dds__in' : 'dds';
      default: return type == CurvesSelection.BBDD ? `${key}__in` : key;
    }
  }

  private getValuesFilterCurves(key: string, value: any[], type: string): any {
    switch(key) {
      case 'tipo': return (Array.isArray(value)) ? value.map(e => (e === 'fs') ? 1 : 0) : (value === 'fs') ? 1 : 0;
      default: return type == CurvesSelection.BBDD ? value : {$in: value};
    }
  }

  /**
   * Create correct format to create temporal process options
   * @param filters actual filters to create curves
   * @param area_id selected area
   * @returns correct body
   */
  formatCreateTemporalProcess(filters: Object = {}, area_id: number): Object {
    let newFilters = Object.entries(filters).reduce((acc, [ key, value ]) => {
      return (!value?.length) ? { ...acc } : { ...acc, [key]: value }
    }, {})
    return {
      configuration: {
        products: newFilters['producto'],
        dds: newFilters['tipo'] || 'fs'
      },
      params: {
        month: newFilters['mes'],
        rattle: newFilters['soca'],
        irrigation: newFilters['riego'],
        zone_eco: newFilters['zona_eco'],
        variety: newFilters['variedad'],
        areas: newFilters['areas'],
        harvest_year: newFilters['zafra']
      },
      area_id: area_id
    }
  }

  /**
   * Change curve data to process filter
   * @param areaId
   * @param curve data
   * @returns a new object with the correct process filter
   */
  formatCurveToProcessFilter(areaId: number, curve: Object) {
    return {
      areas: [areaId],
      mes: (curve['mes']) ? [curve['mes']] : [],
      producto: (curve['producto']) ? [curve['producto']] : [],
      riego: (curve['riego'] !== null && curve['riego'] !== undefined) ? [curve['riego']] : [],
      soca: (curve['soca'] !== null && curve['soca'] !== undefined) ? [curve['soca']] : [],
      tipo: (curve['tipo'] !== null && curve['tipo'] !== undefined) ? [curve['tipo']] : [],
      variedad: (curve['variedad']) ? [curve['variedad']] : [],
      zafra: (curve['zafra'] !== null && curve['zafra'] !== undefined) ? [curve['zafra']] : [],
      zona_eco: (curve['zona_eco'] !== null && curve['zona_eco'] !== undefined) ? [curve['zona_eco']] : [],
    }
  }

  /**
   * Function to format the BBDD existing curve because it does not have all the attributes needed
   * @param element curve
   * @returns
   */
  formatCompareTemporalCurve(curve) {
    return {
      ...this.commonService.translateObject(curve.compare,"curve",'es'),
      producto: curve?.producto || null ,
      variedad: curve?.variedad || null,
      soca: curve?.soca || null,
      dds: curve?.dds,
      mes: curve?.mes || null,
      riego: curve?.riego || null,
      zona_eco: curve?.zona_eco || null
    }
  }
}
