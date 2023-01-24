import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Store } from "@ngrx/store"
import { exhaustMap, map } from "rxjs/operators";
import { grafica, indicador } from "src/app/interfaces/dashboard.interface";
import { AdminService } from "src/app/services/admin.service";
import { DashboardService } from "src/app/services/dashboard.service";
import { AppState } from "src/app/store/app.state";
import { loadDashboardClientes, loadDashboardClientesSuccess, loadDashboardSuperficie, loadDashboardSuperficieSuccess } from "./dashboard.actions";


@Injectable()
export class DashboardEffects{
    constructor(
        private store: Store<AppState>, 
        private actions$:Actions,
        private dashboardService: DashboardService,
        private adminService: AdminService
    ){}

    /** GRÁFICAS */
    graficas$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadDashboardSuperficie),
            exhaustMap((action)=>{
                return this.dashboardService.getHectareasPorCultivo().pipe(
                    map((data)=>{
                        let grafica: grafica[] = this.dashboardService.formateandoGraficas(data);
                        let hectareas_totales: indicador[] = this.dashboardService.hectareasTotales(data);
                        this.store.dispatch(loadDashboardClientesSuccess({data: hectareas_totales}));
                        return loadDashboardSuperficieSuccess({data: grafica});
                    })
                )
            })
        )
    });

    /** CLIENTES */
    clientes$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadDashboardClientes),
            exhaustMap((action)=>{
                return this.dashboardService.getClientes().pipe(
                    map((data)=>{
                        let indicadores: indicador[] = this.dashboardService.filtrarClientes(data);
                        return loadDashboardClientesSuccess({data: indicadores});
                    })
                )
            })
        )
    });

}