import { createReducer, on } from "@ngrx/store";
import { setData, setLoading, setShowUsers, setFilter, saveClientData, setKeyValueAdmin } from "./admin.actions";
import { initialAdminState } from "./admin.state";

const _adminReducer = createReducer(
  initialAdminState,
  on(setData, (state, action) => {
    const { data } = action;
    return {
      ...state,
      data: data
    }
  }),
  on(setLoading, (state, action) => {
    const { loading } = action;
    return {
      ...state,
      loading: loading
    }
  }),
  on(setShowUsers, (state, action) => {
    const { showUsers } = action;
    return {
      ...state,
      showUsers: showUsers
    }
  }),
  on(saveClientData, (state, action) => {
    return {
      ...state,
      dataSelected: action.cliente
    }
  }),
  on(setFilter, (state, action) => {
    let { filter } = action;
    // creamos copia profunda del objeto
    if(filter) filter = { filtro: { ...filter['filtro'] }, title: filter['title'] };
    return {
      ...state,
      filter: filter
    }
  }),
  on(setKeyValueAdmin, (state, action) => {
    const { key, value } = action;
    return {
      ...state,
      [key]: value
    }
  })
);

export const AdminReducer = (state, action) => {
  return _adminReducer(state, action);
}
