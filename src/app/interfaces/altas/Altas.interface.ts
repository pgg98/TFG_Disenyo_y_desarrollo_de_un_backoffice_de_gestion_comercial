export interface FilterAlta {
  attribute: string,
  value: any
}

export const columnsNameAltas = {
  "area.client.workspace": 'Workspace cliente',
  "server.name": 'Servidor',
  "area.name": 'Nombre área',
  "type": 'Tipo procesado',
  "status": 'Estado',
  "progress": 'Porcentaje',
  "date": 'Fecha',
  "delay": 'Horas de retraso',
  "time_execution": 'Tº de ejec',
  "priority": 'Prioridad',
  "client": "Tipo cliente"
}

export const displayedColumnsAltas = Object.keys(columnsNameAltas);

export const filterColumnsAltas = [
  'area.client.workspace',
  'area.name'
]

export interface PaginationFilterInput {
  page?: number,
  limit?: number,
  orderby?: string,
  filter?: FilterAlta[],
  load?: boolean,
  date?: string
}
