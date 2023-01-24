import { createAction, props } from "@ngrx/store";

/** PROVIDERS */
export const LOAD_PROVIDERS = '[productsConfiguration] load providers';
export const LOAD_PROVIDERS_SUCCESS = '[productsConfiguration] load providers success';

export const loadProviders = createAction(
  LOAD_PROVIDERS
);

export const loadProvidersSuccess = createAction(
  LOAD_PROVIDERS_SUCCESS,
  props<{providers: any[]}>()
);

/** CONFIGURATIONS */

export const SAVE_PRODUCT_CONFIGURATION = '[productsConfiguration] save product configuration';
export const SAVE_PRODUCT_CONFIGURATION_SUCCESS = '[productsConfiguration] save product configuration success';

export const saveProductConfiguration = createAction(
  SAVE_PRODUCT_CONFIGURATION,
  props<{product_conf: any, id: number}>()
);

export const saveProductConfigurationSuccess = createAction(
  SAVE_PRODUCT_CONFIGURATION_SUCCESS,
  props<{result: any}>()
);

/** PRODUCTS */
export const SAVE_PRODUCT_CONFIGURATIONS_ALL = '[productsConfiguration] save product configurations all';

export const saveProductConfigurationsAll = createAction(
  SAVE_PRODUCT_CONFIGURATIONS_ALL,
  props<{products: any}>()
);

/** PRODUCTS */
export const SAVE_PLANS = '[productsConfiguration] save plans';

export const savePlans = createAction(
  SAVE_PLANS,
  props<{products: any}>()
);
