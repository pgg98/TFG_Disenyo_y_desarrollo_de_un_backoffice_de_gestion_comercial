import { SHARE_STATE_NAME } from './share/share.selector';
import { ShareReducer } from './share/share.reducer';
import { ShareState } from './share/share.state';



import { AUTH_STATE_NAME } from '../auth/state/auth.selector';
import { AuthReducer } from '../auth/state/auth.reducer';
import { AuthState } from '../auth/state/auth.state';
import { AdminState } from '../pages/admin/state/admin.state';
import { ADMIN_STATE_NAME } from '../pages/admin/state/admin.selector';
import { AdminReducer } from '../pages/admin/state/admin.reducer';
import { EDITOR_STATE_NAME } from '../commons/editor/state/editor.selector';
import { EditorState } from '../commons/editor/state/editor.state';
import { EditorReducer } from '../commons/editor/state/editor.reducer';
import { ProductsConfigurationState } from '../pages/admin/products_configuration/state/productsConfiguration.state';
import { PRODUCTSCONFIGURATION_STATE_NAME } from '../pages/admin/products_configuration/state/productsConfiguration.selector';
import { ProductsConfigurationReducer } from '../pages/admin/products_configuration/state/productsConfiguration.reducer';

export interface AppState {
  [SHARE_STATE_NAME]:ShareState,
  [AUTH_STATE_NAME]:AuthState,
  [ADMIN_STATE_NAME]:AdminState,
  [EDITOR_STATE_NAME]: EditorState,
  [PRODUCTSCONFIGURATION_STATE_NAME]: ProductsConfigurationState
}

export const appReducer = {
  [SHARE_STATE_NAME]: ShareReducer,
  [AUTH_STATE_NAME]:AuthReducer,
  [ADMIN_STATE_NAME]:AdminReducer,
  [EDITOR_STATE_NAME]: EditorReducer,
  [PRODUCTSCONFIGURATION_STATE_NAME]: ProductsConfigurationReducer
};

