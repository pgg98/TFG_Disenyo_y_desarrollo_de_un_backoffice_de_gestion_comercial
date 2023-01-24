import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GenerarCurvasState } from "./generar-curvas.state";

export const GENERARCURVAS_STATE_NAME = 'generarCurvas';

const getGenerarCurvasState = createFeatureSelector<GenerarCurvasState>(GENERARCURVAS_STATE_NAME);

/** LOAD UNIQUES */
export const getProcessFilters = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.process_filters : null
});
export const getProcessFiltersOptions = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.process_filters_options : null
});

/** LOAD PROCESSES */
export const getProcesses = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.processes : null
});

/** PROCESS CURVES */
export const getProcessCurves = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.process_curves : null
});

/** OPTIM CURVES */
export const getOptimCurves = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.optim_curves : null
});

/** LOADING PROCESS */
export const getLoadingProcessesFilter = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.loadingProcessesFilter : null
});

/** LOAD PROCESSES */
export const getProcessCurvesChecked = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.process_curves_checked : []
});

/** LOADING */
export const getGenerarCurvasLoading = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.loading_curves : null
});

/** GET TOTAL COMPARE CURVES */
export const getTotalCompareCurves = createSelector(getGenerarCurvasState, (state) => {
  return state ? state.compare_total_curves : null
});
