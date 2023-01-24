export interface indicador{
    titulo: string;
    numero: number;
}

 export interface grafica{
    titulo: string;
    tipo: number;
    sets: Array<object>;
    labels: Array<string>;
}