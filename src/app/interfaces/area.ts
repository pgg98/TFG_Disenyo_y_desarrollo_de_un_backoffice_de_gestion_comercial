export class Area {
  id?: number;
  nombre?: string;
  fin_actualizacion: string;
  cultivo: string;
  titulo: string;
  terminado: boolean;
  epsg_proj?: string;
  epsg_code?: string;
  padre?: {id: number, nombre: string};
  superficie?: number;
  id_label?: string;
  unidad_01?: string;
  unidad_02?: string;
  unidad_03?: string;
  unidad_04?: string;
  unidad_05?: string;

 
  constructor(titulo: string, cultivo:string, fin_actualizacion:string, terminado:boolean, id?: number, nombre?: string, epsg_proj?: string, epsg_code?: string, padre?: {id: number, nombre: string},superficie?:number,
    id_label?: string, unidad_01?: string, unidad_02?: string, unidad_03?: string, unidad_04?: string, unidad_05?: string) {
    if (id) {
      this.id = id;
    }
    if (nombre) {
      this.nombre = nombre;
    }
    if (epsg_proj) {
      this.epsg_proj = epsg_proj;
    }
    if (epsg_code) {
      this.epsg_code = epsg_code;
    }
    if (padre) {
      this.padre = padre;
    }
    if (superficie) {
      this.superficie = superficie;
    }
    if (id_label) {
      this.id_label = id_label
    }
    if (unidad_01) {
      this.unidad_01 = unidad_01
    }
    if (unidad_02) {
      this.unidad_02 = unidad_02
    }
    if (unidad_03) {
      this.unidad_03 = unidad_03
    }
    if (unidad_04) {
      this.unidad_04 = unidad_04
    }
    if (unidad_05) {
      this.unidad_05 = unidad_05
    }

    this.cultivo = cultivo;
    this.titulo = titulo;
    this.terminado = terminado;
    this.fin_actualizacion = fin_actualizacion;
  }
}