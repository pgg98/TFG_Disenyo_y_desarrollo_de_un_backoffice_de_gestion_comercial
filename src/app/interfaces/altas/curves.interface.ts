export interface OptionsProcessFilter {
  areas?: number[],
  //algoritmo?: string,
  tipo?: string,
  producto?: string[]
}

export enum CurvesSelection {
  BBDD = 'BBDD',
  TEMPORALES = 'Temporales'
}
