import { createReducer, on } from "@ngrx/store";
import { checkProcessCurve, generarCurvasLoading, loadFiltersSucces, loadOptimCurvesSuccess, loadProcessCurvesSuccess, loadProcessesSuccess, resetGenerarCurvasState, setStateGeneratedCurves } from "./generar-curvas.actions";
import { initialGenerarCurvasState, Process } from "./generar-curvas.state";

const _GenerarCurvasReducer = createReducer(
  initialGenerarCurvasState,
  on(loadFiltersSucces, (state, action) => {
    let new_process_filters: any = action.filters;
    if(action.tipo == 1){
      return {
        ...state,
        process_filters: new_process_filters
      }
    }else{
      return {
        ...state,
        process_filters_options: new_process_filters
      }
    }
  }),
  on(loadProcessesSuccess, (state, action) => {
    let processes_list: Process[] = action.processes ? action.processes : null
    return {
      ...state,
      processes: processes_list
    }
  }),
  on(loadProcessCurvesSuccess, (state, action) => {
    let curves: any = action.processCurves
    return {
      ...state,
      process_curves: curves
    }
  }),
  on(loadOptimCurvesSuccess, (state, action) => {
    let curves: any = action.optimCurves
    return {
      ...state,
      optim_curves: curves
    }
  }),
  on(setStateGeneratedCurves, (state, { key, value }) => {
    return {
      ...state,
      [key]: value
    }
  }),
  on(generarCurvasLoading, (state, { value, info }) => {
    return {
      ...state,
      loading_curves: {
        value: value,
        info: info || null
      }
    }
  }),
  on(checkProcessCurve, (state, { id }) => {
    let checks: string[] = state.process_curves_checked ? JSON.parse(JSON.stringify(state.process_curves_checked)) : []

    if(id){
      id.forEach(element => {
        let index = checks.findIndex((el: string) => el == element)
        index > -1 ? checks.splice(index,1) : checks.push(element)
      });
    }else{
      checks = []
    }

    return {
      ...state,
      process_curves_checked: checks
    }
  }),
  on(resetGenerarCurvasState, (state, action) => {
    let newState = initialGenerarCurvasState
    return {
      ...newState,
    }
  }),
);

export const GenerarCurvasReducer = (state, action) => {
  return _GenerarCurvasReducer(state, action);
}
