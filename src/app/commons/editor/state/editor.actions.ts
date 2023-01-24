import { Form } from "@angular/forms";
import { createAction, props } from "@ngrx/store";
import { Area } from "src/app/interfaces/area";
import { herramienta } from "src/app/interfaces/herramienta.interface";
import { Producto } from "src/app/interfaces/producto";
import { UserRegisterInterface } from "src/app/interfaces/UserRegister.interface";
import { zafra } from "src/app/interfaces/zafra.interface";

/** PRODUCTOS */
export const LOAD_EDITOR_PRODUCTOS = "[ editor page] load editor productos";
export const LOAD_EDITOR_PRODUCTOS_SUCCES = "[ editor page] load editor productos success";
export const CHANGE_EDITOR_PRODUCT = "[ editor page] change editor product";

export const loadEditorProductos = createAction(
    LOAD_EDITOR_PRODUCTOS,
    props<{ data: any[] , area: Area}>()
);

export const loadEditorProductosSucces = createAction(
    LOAD_EDITOR_PRODUCTOS_SUCCES,
    props<{area: Area, productos: Producto[]}>()
);

export const changeEditorProduct = createAction(
    CHANGE_EDITOR_PRODUCT,
    props<{ producto: Producto, value: boolean, index: number, area: number }>()
);

export const LOAD_AREA_PRODUCTS = "[ editor page] load area products";

export const loadAreaProducts = createAction(
    LOAD_AREA_PRODUCTS,
    props<{area: Area, tipo?: string}>()
);

export const CREATE_AREA_PRODUCTS = "[ editor page] create area products";

export const createAreaProducts = createAction(
    CREATE_AREA_PRODUCTS,
    props<{peticiones: any[]}>()
);

export const CREATE_AREA_PRODUCTS_SUCCESS = "[ editor page] create area products success";

export const createAreaProductsSuccess = createAction(
    CREATE_AREA_PRODUCTS_SUCCESS,
    props<{result?: boolean}>()
);

export const SAVE_AREA_PRODUCTS = "[ editor page] save area products";

export const saveAreaProducts = createAction(
    SAVE_AREA_PRODUCTS,
    props<{productos: any[]}>()
);

export const AREAS_ALL = "[ editor page] areas all";

export const areasAll = createAction(
    AREAS_ALL,
    props<{filtros: any[]}>()
);

export const AREAS_ALL_SUCCESS = "[ editor page] areas all success";

export const areasAllSuccess = createAction(
    AREAS_ALL_SUCCESS,
    props<{areas: any}>()
);


/** HERRAMIENTAS */
export const LOAD_EDITOR_HERRAMIENTAS = "[ editor page] load editor herramientas";
export const LOAD_EDITOR_HERRAMIENTAS_SUCCES = "[ editor page] load editor herramientas success";
export const CHANGE_EDITOR_HERRAMIENTAS = "[ editor page] change editor herramientas";

export const loadEditorHerramientas = createAction(
    LOAD_EDITOR_HERRAMIENTAS,
    props<{ data: any[] }>()
);

export const loadEditorHerramientasSucces = createAction(
    LOAD_EDITOR_HERRAMIENTAS_SUCCES,
    props<{ data: Array<herramienta> }>()
);

export const changeEditorHerramienta = createAction(
    CHANGE_EDITOR_HERRAMIENTAS,
    props<{ herramienta: herramienta, value: boolean, index: number }>()
);

/** CLIENTE */
export const EDIT_CLIENT = "[ editor page] edit client "
export const EDIT_CLIENT_SUCCESS = "[ editor page] edit client success "
export const LOAD_CLIENT_AREAS = "[ editor page] load client areas "
export const LOAD_CLIENT_AREAS_SUCCESS = "[ editor page] load client areas succes "
export const CREATE_AREA = "[ editor page] create areas "
export const CREATE_AREA_SUCCESS = "[ editor page] create areas success "
export const SET_ALL_PRODUCTOS = "[editor page] set all productos"

export const editClient = createAction(
    EDIT_CLIENT,
    props<{ clientId: number, clientData: any, userId?: number, userData?: string, client?: any, isNew?: boolean, tab?: number }>()
)

export const editClientSuccess = createAction(
    EDIT_CLIENT_SUCCESS,
    props<{ data?:any, category?: number, result?: boolean, isNew?: boolean }>()
)

export const loadClientAreas = createAction(
    LOAD_CLIENT_AREAS,
    props<{ clientId: number }>()
)

export const loadClientAreasSucces = createAction(
    LOAD_CLIENT_AREAS_SUCCESS,
    props<{ data: any }>()
)

export const createArea = createAction(
    CREATE_AREA,
    props<{ clientId: number, area: string }>()
)

export const createAreaSuccess = createAction(
    CREATE_AREA_SUCCESS,
    props<{ data: Area }>()
)

export const setAllProductos = createAction(
  SET_ALL_PRODUCTOS,
  props<{ productos: Object[] }>()
)

export const EXPIRE_CLIENT = "[editor page] expire client";

export const expireClient = createAction(
    EXPIRE_CLIENT,
    props<{ client: any}>()
);

/** USUARIO */
export const EDIT_USER = "[ editor page] edit user "
export const CLEAR_EDITOR_STATE = "[ editor page] clear editor state";
export const EDIT_USER_SUCCESS = "[ editor page] edit user success"
export const LOAD_DATA_SPECIFIC_CLIENT = "[ editor page] load data specific client"

export const editUser = createAction(
    EDIT_USER,
    props<{ userId: number, userData: string, category?: number }>()
)

export const clearEditorState = createAction(
  CLEAR_EDITOR_STATE
);

export const editUserSuccess = createAction(
    EDIT_USER_SUCCESS,
    props<{ data: Object, category?: number, result?: boolean, isNew?: boolean }>()
)

export const SAVE_NEW_USER = "[ editor page] save new user";

export const saveNewUser = createAction(
  SAVE_NEW_USER,
  props<{ user: UserRegisterInterface, client: Object, category: number }>()
);

export const loadDataSpecificClient = createAction(
  LOAD_DATA_SPECIFIC_CLIENT,
  props<{ user: string, category: number, client: Object, correo?: string, isNew?: boolean }>()

)


/** POLIGONOS */
export const ADD_POLIGONO = "[ editor page] add poligono "
export const ADD_POLIGONO_SUCCESS = "[ editor page] add poligono success"
export const SEND_POLIGONO = "[ editor page] send poligono "
export const SEND_POLIGONO_SUCCESS = "[ editor page] send poligono success"
export const UNIQUES_LIMITED = "[ editor page] uniques limited "
export const UNIQUES_LIMITED_SUCCESS = "[ editor page] uniques limited success"
export const UNIQUES = "[ editor page] unique "
export const UNIQUES_SUCCESS = "[ editor page] uniques success"
export const FINISH_AREA = "[ editor page] finish area "
export const FINISH_AREA_SUCCESS = "[ editor page] finish area success"

export const addPoligono = createAction(
    ADD_POLIGONO,
    props<{ areaId: number, form: any, tipo: number }>()
)

export const addPoligonoSuccess = createAction(
    ADD_POLIGONO_SUCCESS,
    props<{ data: any }>()
)

export const sendPoligono = createAction(
    SEND_POLIGONO,
    props<{ areaId: number, datos: any, tipo: number, clientID: number, addCompare: string }>()
)

export const sendPoligonoSuccess = createAction(
    SEND_POLIGONO_SUCCESS,
    props<{ data: any }>()
)

export const uniquesLimited = createAction(
    UNIQUES_LIMITED,
    props<{ areaId: number, datos: any }>()
)

export const uniquesLimitedSuccess = createAction(
    UNIQUES_LIMITED_SUCCESS,
    props<{ data: any }>()
)

export const uniques = createAction(
    UNIQUES,
    props<{ areaId: number, datos: any }>()
)

export const uniquesSuccess = createAction(
    UNIQUES_SUCCESS,
    props<{ data: any }>()
)

export const finishArea = createAction(
    FINISH_AREA,
    props<{ areaId: number, clienteId: number }>()
)

export const finishAreaSuccess = createAction(
    FINISH_AREA_SUCCESS,
    props<{ data: any }>()
)

export const EDIT_AREA_SUCCESS = "[ editor page] edit area success";
export const EDIT_AREA = "[ editor page] edit area";

export const editArea = createAction(
  EDIT_AREA,
  props<{ id: number, data: Object, idCliente: number }>()
);

export const editAreaSuccess = createAction(
  EDIT_AREA_SUCCESS,
  props<{ result: boolean }>()
);

export const REGISTER_CLIENT_TO_STRIPE = "[editor page] register client to stripe";

export const registerClientToStripe = createAction(
  REGISTER_CLIENT_TO_STRIPE,
  props<{ id: number }>()
);



/** CURVAS */

export const CURVAS_OPTIMAS = "[editor page] curvas optimas";

export const curvasOptimas = createAction(
    CURVAS_OPTIMAS,
    props<{ url: string, tipo: number, body?: any, area: Area }>()
);

export const CURVAS_OPTIMAS_SUCCESS = "[editor page] curvas optimas succes";

export const curvasOptimasSuccess = createAction(
    CURVAS_OPTIMAS_SUCCESS,
    props<{ curvas: any, tipo: number }>()
);

export const ASIGNAR_CURVAS = "[editor page] asignar curvas";

export const asignarCurvas = createAction(
    ASIGNAR_CURVAS,
    props<{ area: Area, productos: any[], curvasSeleccionar: any[] }>()
);

export const ASIGNAR_CURVAS_SUCCESS = "[editor page] asignar curvas succes";

export const asignarCurvasSuccess = createAction(
    ASIGNAR_CURVAS_SUCCESS,
    props<{ data: any }>()
);

export const BORRAR_CURVAS = "[editor page] borrar curvas";

export const borrarCurvas = createAction(
    BORRAR_CURVAS,
    props<{ area: Area, productos: any[], borrar: any[], curvas, variedad }>()
);

export const BORRAR_CURVAS_SUCCESS = "[editor page] borrar curvas succes";

export const borrarCurvasSuccess = createAction(
    BORRAR_CURVAS_SUCCESS,
    props<{ data: any }>()
);

export const ADD_BORRAR_CURVAS = "[editor page] add borrar curvas";

export const addBorrarCurvas = createAction(
    ADD_BORRAR_CURVAS,
    props<{ curvas: any[] , add: boolean}>()
);

export const VACIAR_CURVAS = "[editor page] vaciar curvas";

export const vaciarCurvas = createAction(
    VACIAR_CURVAS
);

export const SET_CURVE_FILTER = "[editor page] set curve filter";

export const setCurveFilter = createAction(
    SET_CURVE_FILTER,
    props<{ filter: any }>()
);

export const LOADING_CURVES = "[editor page] loading curves";

export const loadingCurves = createAction(
    LOADING_CURVES,
    props<{ active: boolean }>()
);
