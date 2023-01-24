import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EditorState } from "./editor.state";


export const EDITOR_STATE_NAME = 'editor';

const getEditorState = createFeatureSelector<EditorState>(EDITOR_STATE_NAME);

/** PRODUCTOS */
export const getEditorProductos = createSelector(getEditorState, (state) => {
    return state.productos;
});

export const getProductosArea = createSelector(getEditorState, (state) => {
    return state.productosAreaAsignar;
});

/** HERRAMIENTAS */
export const getEditorHerramientas = createSelector(getEditorState, (state) => {
    return state.herramientas;
});

/** AREAS */
export const getAreasCliente = createSelector(getEditorState, (state) => {
    return state.areas;
});

export const getAreasAll = createSelector(getEditorState, (state) => {
    return state.areasSeleccionar;
});

/** POLIGONOS */
export const getAddPoligono = createSelector(getEditorState, (state) => {
    return state.responsePoligono;
}); 
export const getParcelasArea = createSelector(getEditorState, (state) => {
    return state.responseUniquesLimited;
});
export const getUniques = createSelector(getEditorState, (state) => {
    return state.responseUniques;
});  

/** CURVAS */
export const getCurvas = createSelector(getEditorState, (state) => {
    return state.curvas;
});

export const getCurvasSeleccionar = createSelector(getEditorState, (state) => {
    return state.curvasSeleccionar;
});

export const getCurvasBorrar = createSelector(getEditorState, (state) => {
    return state.curvasBorrar;
});

export const getCurvasFilter = createSelector(getEditorState, (state) => {
    return state.filter;
});

export const getLoadingCurvas = createSelector(getEditorState, (state) => {
    return state.loadingCurve;
});