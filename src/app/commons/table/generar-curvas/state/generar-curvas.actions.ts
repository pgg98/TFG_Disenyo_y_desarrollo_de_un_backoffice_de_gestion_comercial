import { createAction, props } from "@ngrx/store";
import { Process } from "./generar-curvas.state";
import { Pagination } from "src/app/interfaces/Pagination.interface";

/** LOAD UNIQUES */
export const LOAD_GC_UNIQUES = '[productsConfiguration] load gc uniques';
export const loadGenerarCurvasUniques = createAction(
  LOAD_GC_UNIQUES,
  props<{areas: number[]}>()
);

export const LOAD_GC_OPTIONS_UNIQUES = '[productsConfiguration] load gc options uniques';
export const loadGenerarCurvasOptionsUniques = createAction(
  LOAD_GC_OPTIONS_UNIQUES,
  props<{areas: number[], filters: any}>()
);

/** LOAD PROCESS FILTERS */
export const LOAD_PROCESS_FILTERS_SUCCESS = '[productsConfiguration] load process filters success';
export const loadFiltersSucces = createAction(
  LOAD_PROCESS_FILTERS_SUCCESS,
  props<{filters: any[], tipo: number}>()
);

/** LOAD OPTIM CURVES PAGINATION */
export const LOAD_OPTIM_CURVES = '[productsConfiguration] load optim curves';
export const LOAD_OPTIM_CURVES_SUCCESS = '[productsConfiguration] load optim curves success';
export const loadOptimCurves = createAction(
  LOAD_OPTIM_CURVES,
  props<{area: number[], page: number, limit: number, filters: Object }>()
);
export const loadOptimCurvesSuccess = createAction(
  LOAD_OPTIM_CURVES_SUCCESS,
  props<{optimCurves: any}>()
);

/** LOAD PROCESS CURVES PAGINATION */
export const LOAD_PROCESS_CURVES = '[productsConfiguration] load process curves';
export const LOAD_PROCESS_CURVES_SUCCESS = '[productsConfiguration] load process curves success';
export const loadProcessCurves = createAction(
  LOAD_PROCESS_CURVES,
  props<{ area: number, process: string, page: number, limit: number, filters: Object }>()
);
export const loadProcessCurvesSuccess = createAction(
  LOAD_PROCESS_CURVES_SUCCESS,
  props<{ processCurves: Pagination }>()
);

//GET COMPARES PROCESS CURVES
export const GET_CURVES_TO_COMPARE = '[curveConfiguration] get curves to compare'
export const getCurvesToCompare = createAction(
  GET_CURVES_TO_COMPARE,
  props<{process: any, filters?: Object }>()
)

/** LOAD PROCESSES */
export const LOAD_PROCESSES = '[productsConfiguration] load processes';
export const LOAD_PROCESSES_SUCCESS = '[productsConfiguration] load processes success';
export const loadProcesses = createAction(
  LOAD_PROCESSES,
  props<{area: number, filtros:any}>()
);
export const loadProcessesSuccess = createAction(
  LOAD_PROCESSES_SUCCESS,
  props<{processes: any}>()
);

/** DELETE OPTIM CURVES */
export const DELETE_ALL_OPTIM_CURVES = '[productsConfiguration] delete all optim curves';
export const deleteAllOptimCurves = createAction(
  DELETE_ALL_OPTIM_CURVES,
  props<{area: number, filtros:any}>()
);

export const DELETE_SINGLE_OPTIM_CURVE = '[productsConfiguration] delete single optim curve';
export const deleteSingleOptimCurve = createAction(
  DELETE_SINGLE_OPTIM_CURVE,
  props<{area: number, id: number, filtros:any}>()
);

/** DELETE PROCESS CURVES */
export const DELETE_ALL_PROCESS_CURVES = '[productsConfiguration] delete all process curves';
export const deleteAllProcessCurves = createAction(
  DELETE_ALL_PROCESS_CURVES,
  props<{ process: string }>()
);

export const DELETE_PROCESS_CURVES = '[productsConfiguration] delete process curves';
export const deleteProcessCurves = createAction(
  DELETE_PROCESS_CURVES,
  props<{area: number, process: Process, ids: string[], compare: boolean, filters: any}>()
);

/** SAVE CURVES */
export const SAVE_CURVES = '[productsConfiguration] save curves';
export const saveCurves = createAction(
  SAVE_CURVES,
  props<{area: number, process: any, ids: any[], compare: boolean, filters?: any}>()
);

/** ACCEPT COMPARED */
export const ACCEPT_COMPARED_CURVES = '[productsConfiguration] accept compared curves';
export const acceptComparedCurves = createAction(
  ACCEPT_COMPARED_CURVES,
  props<{area: number, process: any, filters: Object}>()
);

/** DISCARD COMPARED */
export const DISCARD_COMPARED_CURVES = '[productsConfiguration] discard compared curves';
export const discardComparedCurves = createAction(
  DISCARD_COMPARED_CURVES,
  props<{area: number, process: string, filters: Object}>()
);

/** ACCEPT COMPARED */
export const ACCEPT_NO_COMPARED_CURVES = '[productsConfiguration] accept no compared curves';
export const acceptNoComparedCurves = createAction(
  ACCEPT_NO_COMPARED_CURVES,
  props<{area: number, process: any, filters: Object}>()
);

/** DISCARD COMPARED */
export const DISCARD_NO_COMPARED_CURVES = '[productsConfiguration] discard no compared curves';
export const discardNoComparedCurves = createAction(
  DISCARD_NO_COMPARED_CURVES,
  props<{area: number, process: string, filters: Object}>()
);

/** DISCARD COMPARED */
export const CHECK_PROCESS_CURVE = '[productsConfiguration] check process curve';
export const checkProcessCurve = createAction(
  CHECK_PROCESS_CURVE,
  props<{ id: any[] }>()
);

/** general change */
export const SET_STATE_GENERATED_CURVES = '[generated curves page] set state generated curves';
export const setStateGeneratedCurves = createAction(
  SET_STATE_GENERATED_CURVES,
  props<{ key: string, value: any }>()
);

/** Reprocess Curve */
export const REPROCESS_CURVE = '[generated curves page] reprocess curve';
export const reprocessCurve = createAction(
  REPROCESS_CURVE,
  props<{ curveId: string, areaId: number }>()
);

/** LOADING CURVES */
export const GENERAR_CURVAS_LOADING = '[generated curves page] generar curvas loading';
export const generarCurvasLoading = createAction(
  GENERAR_CURVAS_LOADING,
  props<{ value: boolean, info?: string }>()
);

/** RESET STATE */
export const RESET_GENERARCURVAS_STATE = '[generated curves page] reset generar curvas state';
export const resetGenerarCurvasState = createAction(
  RESET_GENERARCURVAS_STATE
);

export const CREATE_TEMPORAL_PROCESS = '[generated curves page] create temporal process';
export const createTemporalProcess = createAction(
  CREATE_TEMPORAL_PROCESS,
  props<{ filters: Object, area_id?: number }>()
);

export const DELETE_TEMPORAL_PROCESS = '[generated curves page] delete temporal process';
export const deleteTemporalProcess = createAction(
  DELETE_TEMPORAL_PROCESS,
  props<{ processId: string, area_id: number }>()
);

export const REPROCESS_DB_CURVE = '[generated curves page] reprocess db curve';
export const reprocessDbCurve = createAction(
  REPROCESS_DB_CURVE,
  props<{ curves: Object[], areaId: number }>()
);
