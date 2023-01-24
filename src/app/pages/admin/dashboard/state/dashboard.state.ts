import { grafica, indicador } from '../../../../interfaces/dashboard.interface';

export interface DashboardState{
   graficas:grafica[];
   indicadores:indicador[];
}

export const initialStateDashboard: DashboardState = {
    graficas:null,
    indicadores:null
}