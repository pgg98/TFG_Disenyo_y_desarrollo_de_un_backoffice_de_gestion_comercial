
import { createAction, props } from "@ngrx/store";
import { Usuario } from "src/app/models/usuario.model";
import { Token } from '../../models/auth/token.model'


/** LOGIN */
export const LOGIN_START = "[ auth page] login start";
export const LOGIN_SUCCESS = "[ auth page] login success";

export const loginStart = createAction(
    LOGIN_START,
    props<{ user: string, password: string, saveTokenSuperUser?: boolean }>()
);

export const loginSuccess = createAction(
    LOGIN_SUCCESS,
    props<{token:Token}>()
);

export const CHANGE_LOGIN_WAITING = "[ auth page] change login witing";

export const changeLoginWaiting = createAction(
    CHANGE_LOGIN_WAITING,
    props<{status: boolean}>()
);

/** REFRESH */
export const REFRESH = "[ auth page] refresh";

export const refresh = createAction(
    REFRESH
);


/** AUTO LOGIN */
export const AUTH_LOGIN = "[ auth page] auto login";
export const AUTH_LOGOUT = "[ auth page] auto logout";
export const AUTH_LOGOUT_SUCCESS = "[ auth page] auto logout success";
export const AUTH_LOGIN_FAIL = "[ auth page] auto login fail";

export const autoLogin = createAction(
    AUTH_LOGIN
);
export const logout = createAction(
    AUTH_LOGOUT
);

export const logoutSuccess = createAction(
    AUTH_LOGOUT_SUCCESS,
    props<{token:Token}>()
);

export const autoLoginFail = createAction(
    AUTH_LOGIN_FAIL
)

/** USER */
export const LOAD_USER = '[user page] load user';
export const LOAD_USER_SUCCESS = '[user page] load user success';

export const loadUser = createAction(LOAD_USER);
export const loadUserSuccess = createAction(
    LOAD_USER_SUCCESS,
    props<{user:Usuario}>()
);

/** SUPERUSERS */
export const LOAD_SUPERUSERS = '[user page] load superusers';
export const LOAD_SUPERUSERS_SUCCESS = '[user page] load superusers success';

export const loadSuperusers = createAction(
  LOAD_SUPERUSERS,
  props<{ id?: number }>()
);
export const loadSuperusersSuccess = createAction(
    LOAD_SUPERUSERS_SUCCESS,
    props<{superusers:Usuario[]}>()
);

export const LOAD_SUPERUSER_TOKEN = '[user page] load superuser token';
export const LOAD_SUPERUSER_TOKEN_SUCCESS = '[user page] load superuser token success';

export const loadSuperuserToken = createAction(
    LOAD_SUPERUSER_TOKEN,
    props<{id: number, clientsSuper?: Usuario[]}>()
    );

export const loadSuperuserTokenSuccess = createAction(
    LOAD_SUPERUSER_TOKEN_SUCCESS,
    props<{token:Token}>()
);

/** NO DATA */
export const NO_DATA = "[ auth page] no data";
export const noData = createAction(
    NO_DATA
)
