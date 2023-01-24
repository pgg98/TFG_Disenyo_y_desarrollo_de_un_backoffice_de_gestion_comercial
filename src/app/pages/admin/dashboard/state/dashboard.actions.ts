
import { createAction, props } from "@ngrx/store";
import { grafica, indicador } from "src/app/interfaces/dashboard.interface";

/** GRÁFICAS */
export const LOAD_DASHBOARD_SUPERFICIE = "[ dashboard page] load dashboard superficie";
export const LOAD_DASHBOARD_SUPERFICIE_SUCCESS = "[ dashboard page] load dashboard superficie success";

export const loadDashboardSuperficie = createAction(
    LOAD_DASHBOARD_SUPERFICIE
);

export const loadDashboardSuperficieSuccess = createAction(
    LOAD_DASHBOARD_SUPERFICIE_SUCCESS,
    props<{data:grafica[]}>()
);

/** INDICADORES */
export const LOAD_DASHBOARD_CLIENTES = "[ dashboard page] load dashboard clientes";
export const LOAD_DASHBOARD_CLIENTES_SUCCESS = "[ dashboard page] load dashboard clientes success";

export const loadDashboardClientes = createAction(
    LOAD_DASHBOARD_CLIENTES
);

export const loadDashboardClientesSuccess = createAction(
    LOAD_DASHBOARD_CLIENTES_SUCCESS,
    props<{data:indicador[]}>()
);

/** RESET */
export const RESET_DASHBOARD_STATE = "[ dashboard page] resetDashboardState";

export const resetDashboardState = createAction(
    RESET_DASHBOARD_STATE
);