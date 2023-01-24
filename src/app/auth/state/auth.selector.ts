import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";


export const AUTH_STATE_NAME = 'auth';

const getAuthState = createFeatureSelector<AuthState>(AUTH_STATE_NAME);

/** LOGIN */
export const getLoginWaiting = createSelector(getAuthState, (state) => {
    return state.loginWaiting;
});

/** AUTH */
export const isAuthenticated = createSelector(getAuthState, (state) => {
    return state.token ? true : false;
});

export const getToken = createSelector(getAuthState, (state) => {
    return state.token ? state.token : null;
});

/** USER */
export const getUser = createSelector(getAuthState,(state)=>{
    return state.user;
})

/** SUPERUSER */
export const getSupersusers = createSelector(getAuthState,(state)=>{
    return state.superusers;
})

/**
 * SUPERUSER TOKEN
 */
export const getSupersuserToken = createSelector(getAuthState,(state)=>{
  return state.clientSelectedToken;
})
