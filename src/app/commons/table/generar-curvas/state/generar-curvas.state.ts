import { Pagination } from "src/app/interfaces/Pagination.interface"
import { Area } from "src/app/interfaces/area"

export interface Process {
  name: string
  id: string
}
export interface processFilter{
  areas: Area[]
  producto: string[]
  tipo: string[]
  //algoritmo: string[]
  zafra: number[]
  variedad: string[]
  soca: number[]
  mes:  number[]
  zona_eco: number[]
  riego: number[]
}

export interface GenerarCurvasState {
  processes: Process[]
  process_selected: Process,

  process_filters: processFilter,
  process_filters_options: processFilter,

  process_curves: Pagination,
  optim_curves: any,
  loadingProcessesFilter: boolean

  process_curves_checked: string[]

  compare_total_curves: number
  loading_curves: { value: boolean, info: string | null }
}

export const initialGenerarCurvasState: GenerarCurvasState = {
  processes: [],
  process_selected: null,
  process_filters: {
    areas: [],
    producto: ['agua','lai','clorofila','ndvi'],
    tipo: ['fs','fi'],
    //algoritmo: ['david','anton'],
    zafra: [],
    variedad: [],
    soca: [],
    mes: [1,2,3,4,5,6,7,8,9,10,11,12],
    zona_eco: [],
    riego: []
  },
  process_filters_options: {
    areas: [],
    producto: ['agua','lai','clorofila','ndvi'],
    tipo: ['fs','fi'],
    // algoritmo: ['david','anton'],
    zafra: [],
    variedad: [],
    soca: [],
    mes: [1,2,3,4,5,6,7,8,9,10,11,12],
    zona_eco: [],
    riego: []
  },
  process_curves: null,
  optim_curves: null,
  loadingProcessesFilter: false,
  process_curves_checked: [],
  compare_total_curves: null,
  loading_curves: { value: false, info: null }
}
