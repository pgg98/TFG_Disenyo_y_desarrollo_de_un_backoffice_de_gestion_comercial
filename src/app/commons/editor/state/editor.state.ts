import { Area } from "src/app/interfaces/area";
import { Pagination } from "src/app/interfaces/Pagination.interface";
import { Producto } from "src/app/interfaces/producto";

export interface EditorState{
    productos:{area: Area, productos: Producto[]}[];
    herramientas:any[];
    id:number;
    areas:Area[];
    responsePoligono:any;
    responseUniquesLimited:any;
    productosAreaAsignar:any[];
    responseUniques:any;
    areasSeleccionar:Area[];
    curvas:Pagination;
    curvasSeleccionar:Pagination;
    curvasBorrar:any[];
    filter:any;
    loadingCurve:boolean;
}

export const initialStateEditor: EditorState = {
    productos:null,
    herramientas: null,
    id:0,
    areas:null,
    responsePoligono:null,
    responseUniquesLimited:null,
    responseUniques:null,
    productosAreaAsignar:null,
    areasSeleccionar:null,
    curvas:null,
    curvasSeleccionar:null,
    curvasBorrar:[],
    filter:null,
    loadingCurve:false
}