import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Store } from "@ngrx/store"
import { AppState } from "../app.state"


@Injectable()
export class ShareEffects{
    constructor(
        private store: Store<AppState>, 
        private actions$:Actions,
    ){}

    /*
    loadUniquesLimited$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadUniquesLimited),
            exhaustMap((action)=>{
                let idArea = action.area.id;
                let body = {
                    atributo: [action.attribute],
                    activo: true,
                    limit: action.limit,
                    filtro: action.value
                }

                return this.dashboardService.getUniquesLimited(idArea, body).pipe(
                    map((data)=>{
                        return loadUniquesLimitedSuccess({values: data})
                    })
                );   
            })
        )
    })
    */
}
