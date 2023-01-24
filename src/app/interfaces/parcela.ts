export class Parcela2 {
    idnax: number; id: string; unidad_01: string; unidad_02: string; unidad_03: string; unidad_04: string;
    unidad_05: string; variedad: string; fs: Date; fc: Date; rend: number; cultivo: string;
    area: number; soca: number; fi: Date; ff: Date;
    fe: Date; semillero: boolean; zafra: number;edad:number;
    fc_est: Date; fci: Date; riego: number; rend_est: number;rend_nax:number; zonas: string; zona_eco: number;
    agua_disp: number; agua_aprov: number; agua_act: number; rend_neto: number; ha_corte: number; fecha_max: Date; estrato: string;
    tipo_cos: string; rend_core: number; rend_ind: number; semana_mad: number; obs_madur: string;
    cuadrante: string; tercio: number; riegos_pre: number; riegos_pos: number;  fk_pixel:number; activo:boolean; alta_freq: boolean; inicio_curva: Date; resiembra_pct:number
    constructor(){
      this.idnax=null; 
      this.id=null; 
      this.unidad_01=null; 
      this.unidad_02=null; 
      this.unidad_03=null; 
      this.unidad_04=null;
      this.unidad_05=null; 
      this.variedad=null;
      this.edad=null; 
      this.fs=null; 
      this.fc=null;
      this.rend=null; 
      this.cultivo=null; 
      this.area=null; 
      this.soca=null; 
      this.fi=null; 
      this.ff=null; 
      this.fe=null;
      this.semillero=null; 
      this.zafra=0;
      this.fc_est=null; 
      this.fci=null; 
      this.riego=null;
      this.rend_est=null;  
      this.rend_nax=null; 
      this.zonas=null; 
      this.zona_eco=null;
      this.agua_disp=null;
      this.agua_aprov=null;
      this.agua_act=null;
      this.rend_neto=null; 
      this.ha_corte=null; 
      this.fecha_max=null; 
      this.estrato=null; 
      this.tipo_cos=null;
      this.rend_core=null; 
      this.rend_ind=null; 
      this.semana_mad=null; 
      this.obs_madur=null; 
      this.cuadrante=null; 
      this.ha_corte=null; 
      this.tercio = null;
      this.riegos_pre = null; 
      this.riegos_pos = null;
      this.fk_pixel = null; 
      this.activo = null; 
      this.alta_freq = null;
    }
}