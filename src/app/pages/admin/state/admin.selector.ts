import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AdminState } from "./admin.state";


export const ADMIN_STATE_NAME = 'admin';

const getAdminState = createFeatureSelector<AdminState>(ADMIN_STATE_NAME);

export const getData = createSelector(getAdminState, (state) => {
  return state.data;
});

export const getLoading = createSelector(getAdminState, (state) => {
  return state.loading;
});

export const getShowUsers = createSelector(getAdminState, (state) => {
  return state.showUsers;
});

export const getClientData = createSelector(getAdminState, (state) => {
  return state.dataSelected;
});
export const getFilter = createSelector(getAdminState, (state) => {
  return state.filter;
});

export const getProcesos = createSelector(getAdminState, (state) => {
  return state.procesos;
});

export const getClientsDemosAndClients = createSelector(getAdminState, (state) => {
  return state.clientsDemosClients;
});

export const getLoadingSuperusers = createSelector(getAdminState, (state) => {
  return state.loadingSuperusers;
});

export const getMessageSuperuser = createSelector(getAdminState, (state) => {
  return state.messageSuperUser;
});
