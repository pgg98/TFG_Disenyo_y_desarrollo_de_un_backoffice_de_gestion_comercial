import { ActionReducer, createReducer, on } from "@ngrx/store"
import { initialStateAuth } from "src/app/auth/state/auth.state";
import { initialStateEditor } from "src/app/commons/editor/state/editor.state";
import { initialProductsConfigurationState } from "src/app/pages/admin/products_configuration/state/productsConfiguration.state";
import { initialAdminState } from "src/app/pages/admin/state/admin.state";
import { setTitle, setBreadcrums } from "./share.actions";
import { initialStateShared } from "./share.state";

const _shareReducer = createReducer(
  initialStateShared,
  on(setTitle,(state,action)=>{

    return {
        ...state,
        title: action.title
    }
  }),
  on(setBreadcrums,(state,action)=>{

    return {
        ...state,
        breadcrums: action.breadcrums
    }
  }),
)
export function ShareReducer(state,action){
    return _shareReducer(state,action)
}

export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
    // MetaReducer que se ejecuta antes de cada reducer. Se usa par
    // eliminar todos los datos que se han ido guardando en el state.
    //  Solo se dejan los datos que hay en shared de momento.
    return function (state, action) {
        if (action.type === '[ auth page] auto logout success') {
            var share_aux = Object.assign({}, state.share);
            state = {
                share: share_aux,
                admin: initialAdminState,
                auth: initialStateAuth,
                editor: initialStateEditor,
                productsConfiguration: initialProductsConfigurationState
            }

            return reducer(undefined, action)
        }
        return reducer(state, action);
    };
   }


