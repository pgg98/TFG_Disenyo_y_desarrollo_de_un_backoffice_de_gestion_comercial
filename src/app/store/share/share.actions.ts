import { createAction, props } from "@ngrx/store"

/*
export const SET_PLATFORM_DEVICE  = '[shared state] set platform device'

export const setLoadingSpinner =  createAction(
    SET_LOADING_ACTION,
    props<{status: boolean}>()
);
*/

export const SET_TITLE  = '[shared state] set title'
export const SET_BREADCRUMS  = '[shared state] set breadcrums'

export const setTitle =  createAction(
    SET_TITLE,
    props<{title: string}>()
);

export const setBreadcrums =  createAction(
  SET_BREADCRUMS,
  props<{breadcrums: Object[]}>()
);
