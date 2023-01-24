export enum GenerarCurvasCompareOptions {
  SELECCIONADAS = 'seleccionadas',
  COMPARADAS = 'con comparación',
  NO_COMPARADAS = 'sin comparación',
}

export interface PaginationUrlOptions {
  url?: string,
  page?: number,
  limit?: number,
  orderBy?: string
}
export enum ProdcutsMaxValuesGraphic {
  agua = 0.11,
  clorofila = 200,
  lai = 6,
  ndvi = 1.1
}
