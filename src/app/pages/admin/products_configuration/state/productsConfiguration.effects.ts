import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from "rxjs/operators";
import { AdminService } from "src/app/services/admin.service";
import { loadProviders, loadProvidersSuccess, saveProductConfiguration, saveProductConfigurationSuccess } from './productsConfiguration.actions'


@Injectable()
export class ProductsConfigurationEffects{
  constructor(
    private actions$:Actions,
    private adminService: AdminService,
  ){ }

  /** PRODUCT CONF */
  loadProviders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadProviders),
      mergeMap((action) => {
        return this.adminService.getProviders().pipe(
          map((result) => {
            return loadProvidersSuccess({ providers: result });
          })
        )
      })
    )
  });
  saveProductConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(saveProductConfiguration),
      mergeMap((action) => {
        return this.adminService.saveProductConfiguration(action.product_conf, action.id).pipe(
          map((result) => {
            return saveProductConfigurationSuccess({ result: result });
          })
        )
      })
    )
  });
}
