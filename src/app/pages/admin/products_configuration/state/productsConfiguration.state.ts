import { Plan } from "src/app/interfaces/plan"

export interface ProductsConfigurationState {
  providers: any,
  productsAll: any,
  plans: Plan[]
}

export const initialProductsConfigurationState: ProductsConfigurationState = {
  providers: null,
  productsAll: null,
  plans: [
    {
        titulo: 'basic',
        herramientas: ['histograma','curva','mapa_variable','tareas','precosecha','videos','medicion','crear_poligono','descargas','capas'],
        productos: ['clorofila_optimo','lai_optimo','agua_optimo','agua','ndvi','anomalias','real','ndvi_optimo','lai','produccion','ndwi','clorofila']
    },
    {
        titulo: 'basic_canha',
        herramientas: ['histograma','curva','mapa_variable','tareas','precosecha','videos','medicion','crear_poligono','descargas','capas'],
        productos: ['clorofila_optimo','lai_optimo','agua_optimo','agua','ndvi','anomalias','real','ndvi_optimo','lai','produccion','ndwi','clorofila','agua_filt','lai_filt','ndvi_filt','cosecha','maduracion','maduracion_filt','nitrogenado','riego']
    },
    {
        titulo: 'basic_arroz',
        herramientas: ['histograma','curva','mapa_variable','tareas','precosecha','videos','medicion','crear_poligono','descargas','capas'],
        productos: ['clorofila_optimo','lai_optimo','agua_optimo','agua','ndvi','anomalias','real','ndvi_optimo','lai','produccion','ndwi','clorofila','clorofila_filt','lai_filt','inundacion','humedad_grano','nitrogenado']
    },
    {
        titulo: 'todo',
        herramientas: ['histograma','curva','mapa_variable','tareas','precosecha','videos','medicion','crear_poligono','descargas','capas'],
        productos: ['riego','analisis_de_agua','nir','clorofila_optimo','msavi2','analisis_de_avance','lai_optimo','agua_optimo','conformidad_riego','cuando_fertilizar_foliar','verde','conformidad_fertilizado','inundacion_optico2','anomalias_af','inundacion_optico','humedad_filt2','cuando_fertilizar_al_suelo','clorofila_filt','humedad','vv','agua','conformidad_porcentaje_optimo','maleza_temporal','vh_vv','inundacion_rgb','inundacion','calidad_pasto','fertilizado_fraccionamiento','cosecha_af','fertilizado_foliar','planificacion_riego','balance_hidrico','frescura_canha','nitrogenado','tch','ndvi','humedad_grano','cuanto_fertilizado','vh','humedad_filt','inundacion_modelo','azul','rojo','maduracion_filt','anomalias','fertilizado_al_suelo','rvi2','real','confor_ferti_fraccionamiento','confor_ferti_foliar','ndvi_optimo','rojo_cercano','cosecha','ndmi','evapotranspiration','biomasa_seca','rvi','eficiencia_fertilizado','imagen_real_af','analisis_avance_de_riego','cuando_fertilizar_fraccionamiento','maduracion','lai','lci','ndvi_filt','lai_filt','ndvi_af','agua_filt','deteccion_de_agua','maleza','produccion','ndwi','confor_ferti_al_suelo','clorofila']
    }
  ]
}
