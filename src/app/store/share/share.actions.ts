import { createAction, props } from "@ngrx/store"

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
