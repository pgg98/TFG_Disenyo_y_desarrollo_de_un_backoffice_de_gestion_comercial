import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DashboardState } from "./dashboard.state";


export const DASHBOARD_STATE_NAME = 'dashboard';

const getDashboardState = createFeatureSelector<DashboardState>(DASHBOARD_STATE_NAME);

/** GRÁFICAS */
export const getDashboardSuperficies = createSelector(getDashboardState, (state) => {
    return state.graficas;
});

/** INDICADORES */
export const getDashboardClientes = createSelector(getDashboardState, (state) => {
    return state.indicadores;
});