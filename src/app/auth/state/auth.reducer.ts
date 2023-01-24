import { createReducer, on, ReducerTypes } from "@ngrx/store";
import { changeLoginWaiting, loadSuperusersSuccess, loadSuperuserTokenSuccess, loadUserSuccess, loginSuccess, logoutSuccess } from "./auth.actions";
import { initialStateAuth } from "./auth.state";


const _authReducer = createReducer(
  initialStateAuth,
  on(loginSuccess, (state, action) => {
    return {
      ...state,
      token: action.token,
    };
  }),
  on(logoutSuccess, (state, action) => {
    return {
      ...state
    };
  }),
  on(loadUserSuccess, (state, action) => {
    return  {
      ...state,
      user: action.user
    };
  }),
  on(changeLoginWaiting, (state, action) => {
    return  {
      ...state,
      loginWaiting: action.status
    };
  }),
  on(loadSuperusersSuccess, (state, action) => {
    return  {
      ...state,
      superusers: action.superusers
    };
  }),
  on(loadSuperuserTokenSuccess, (state, action) => {
    return  {
      ...state,
      clientSelectedToken: action.token
    };
  }),
);

export function AuthReducer(state,action){
    return _authReducer(state,action);
}

