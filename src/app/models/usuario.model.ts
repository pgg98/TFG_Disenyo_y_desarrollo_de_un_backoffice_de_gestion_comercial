export class Usuario {

    constructor( 
        // datos generales
        public id: number,
        public user: string,
        public password: string,
        
        // permisos
        public ver_dashboard: boolean,
        public ver_admin: boolean,
        public ver_tarea: boolean,
        public editar_parcela: boolean,
        public filtro: string,

        // relaciones
        public fk_cliente: any, // Cliente
        public fk_tablero: any, // Tablero
        public fk_contacto: any, // Contacto
        public areas: any[], // Area
        public tareas: any[], // Tarea
        public notificaciones: any[], // notificacion

        // metricas
        public last_login: number,
        public contador_login: number,
    ) {}

}