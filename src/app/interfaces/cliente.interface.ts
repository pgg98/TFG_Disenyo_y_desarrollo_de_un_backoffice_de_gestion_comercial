export interface cliente {
    correo: string;
    telefono: string;
    nombre: string;
    apellidos: string;
    pais: string;
    cultivo: string;
    hectareas: number;
    empresa: string;
    verificado: boolean;
    contactado: boolean;
    fecha_registro: Date;
    fecha_vencimiento: Date;
    fin_actualizacion: Date;
    alta_frec: Date;
    hectareas_de_planet: number;
    pagado: boolean;
    tipo_de_pago: string;
}