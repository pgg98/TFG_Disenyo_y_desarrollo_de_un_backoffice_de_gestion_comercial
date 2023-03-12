import { createAction, props } from "@ngrx/store";
import { Tile } from "src/app/interfaces/tiles.interface";
import { Area } from "src/app/interfaces/area";
import { Pagination } from "src/app/interfaces/Pagination.interface";

export const LOAD_DATA = '[admin] load data';
export const SET_KEY_VALUE_ADMIN = '[admin] set key value admin';
export const LOAD_DATA_NOVEDADES = '[admin] load data novedades';
export const LOAD_DATA_PRODUCTOS_CONF = '[admin] load productos conf';
export const LOAD_USERS_CLIENT = '[admin] load users client';
export const SET_DATA = '[admin] set data';
export const SET_SHOW_USERS = '[admin] set show users';
export const SET_LOADING = '[admin] set loading';
export const SET_FILTER = '[admin] set filter';
export const GET_DATA_BY_URL = '[admin] get data by url';
export const SAVE_CLIENT_DATA = '[admin] save client data';
export const EDIT_CATEGORY = "[ editor page] edit category "
export const EDIT_CATEGORY_SUCCESS = "[ editor page] edit category "
export const BORRAR_NOVEDADES = "[admin] borrar novedades ";
export const LOAD_CLIENTS_DEMOS_AND_CLIENTS = "[admin] load clients demos and clients ";
export const SET_CLIENTS_DEMOS_AND_CLIENTS = "[admin] set clients demos and clients ";
export const CREAR_NOVEDAD = "[admin] crear novedad";
export const CREAR_NOVEDAD_SUCCESS = "[admin] crear novedad success";
export const EDITAR_NOVEDAD = "[admin] editar novedad";
export const EDITAR_NOVEDAD_SUCCESS = "[admin] editar novedad success";
export const LOAD_PROCCESSES = '[admin] load proccesses';
export const SET_PROCCESSES = '[admin] set proccesses';
export const MOVE_PROCESS = '[admin] move process';
export const MOVE_PROCESS_UP = '[admin] move process up';
export const MOVE_PROCESS_DOWN = '[admin] move process down';


export const editCategory = createAction(
  EDIT_CATEGORY,
  props<{ client: any, category: number}>()
)

export const editCategorySuccess = createAction(
  EDIT_CATEGORY_SUCCESS
)

export const loadData = createAction(
  LOAD_DATA,
  props<{category: number, body?: any, orderby?: string}>()
);

export const loadDataNovedades = createAction(
  LOAD_DATA_NOVEDADES,
  props<{body?: any}>()
);

export const loadDataProductosConf = createAction(
  LOAD_DATA_PRODUCTOS_CONF,
  props<{body?: any}>()
);

export const getDataByUrl = createAction(
  GET_DATA_BY_URL,
  props<{url: string, body?: Object, category?: number}>()
);

export const setLoading = createAction(
  SET_LOADING,
  props<{loading: boolean}>()
);

export const setData = createAction(
  SET_DATA,
  props<{data: Pagination}>()
);

export const setShowUsers = createAction(
  SET_SHOW_USERS,
  props<{showUsers: boolean}>()
);

export const loadUsersClient = createAction(
  LOAD_USERS_CLIENT,
  props<{idCliente: number, body?: Object}>()
);

export const setFilter = createAction(
  SET_FILTER,
  props<{filter: Object}>()
);

export const saveClientData = createAction(
  SAVE_CLIENT_DATA,
  props<{cliente: any}>()
);

export const borrarNovedades = createAction(
  BORRAR_NOVEDADES,
  props<{novedades?: Object[], filtro?: Object}>()
);

export const loadClientsDemosAndClients = createAction(
  LOAD_CLIENTS_DEMOS_AND_CLIENTS
);

export const crearNovedad = createAction(
  CREAR_NOVEDAD,
  props<{novedad: Object}>()
);

export const crearNovedadSuccess = createAction(
  CREAR_NOVEDAD_SUCCESS,
  props<{result: boolean}>()
);

export const editarNovedad = createAction(
  EDITAR_NOVEDAD,
  props<{body: Object, id: number}>()
);

export const editarNovedadSuccess = createAction(
  EDITAR_NOVEDAD_SUCCESS,
  props<{result: boolean}>()
);

export const loadProccesses = createAction(
  LOAD_PROCCESSES,
  props<{ processed?: boolean }>()
);

export const GET_AREAS_CLIENTE= '[navigation] get areas cliente';
export const GET_AREAS_CLIENTE_SUCCESS= '[navigation] get areas cliente success';

export const getAreasCliente = createAction(
    GET_AREAS_CLIENTE,
    props<{cliente? :number}>()
);

export const setKeyValueAdmin = createAction(
  SET_KEY_VALUE_ADMIN,
  props<{ key: string, value: any }>()
);
