export enum TypeStadisticsAltas {
  CLIENTS = 'clients',
  TYPE = 'type',
  STATUS = 'status',
  TIME = 'time'
}

export const dataStadisticts = {
  [TypeStadisticsAltas.CLIENTS]: {
    id: 'client',
    hide: false,
    title: 'Tipo de clientes por proceso',
    data: {
      clients: null,
      demos: null
    }
  },
  [TypeStadisticsAltas.TYPE]: {
    id: 'type',
    hide: false,
    title: 'Tipos de los procesos',
    data: {
      reprocessing: null,
      update: null
    }
  },
  [TypeStadisticsAltas.STATUS]: {
    id: 'status',
    hide: false,
    title: 'Estado de los procesos',
    data: {
      completed: null,
      error: null,
      executing: null,
      queue: null,
      stopped: null
    }
  },
  [TypeStadisticsAltas.TIME]: {
    id: 'time',
    hide: false,
    title: 'Tiempo de proceso',
    data: {
      date: null,
      delay: null,
      progress: null,
      time_execution: null
    }
  },
}
