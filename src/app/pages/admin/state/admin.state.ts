import { Tile } from "src/app/interfaces/tiles.interface"
import { Pagination } from "src/app/interfaces/Pagination.interface"

export interface AdminState {
  data: Pagination,
  loading: boolean,
  showUsers: boolean,
  dataSelected: any
  filter: Object,
  procesos: Tile[],
  clientsDemosClients: Object[],
  areasClientes: Object,
  loadingSuperusers: boolean,
  messageSuperUser: string | null
}

export const initialAdminState: AdminState = {
  data: null,
  loading: false,
  showUsers: false,
  dataSelected: null,
  filter: undefined,
  procesos: null,
  clientsDemosClients: null,
  areasClientes: [],
  loadingSuperusers: false,
  messageSuperUser: null
}

export enum labelsStateAdmin {
  DATA = 'data',
  LOADING = 'loading',
  SHOW_USERS = 'showUsers',
  DATA_SELECTED = 'dataSelected',
  FILTER = 'filter',
  PROCESOS = 'procesos',
  CLIENTS_DEMOS = 'clientsDemosClients',
  AREAS_CLIENTES = 'areasClientes',
  LOADING_SUPERUSERS = 'loadingSuperusers',
  MESSAGE_SUPER = 'messageSuperUser'
}
