import { createReducer, on } from "@ngrx/store";
import { loadProvidersSuccess, savePlans, saveProductConfigurationsAll } from "./productsConfiguration.actions";
import { initialProductsConfigurationState } from "./productsConfiguration.state";

const _productsConfigurationReducer = createReducer(
  initialProductsConfigurationState,
  on(loadProvidersSuccess, (state, action) => {
    return {
      ...state,
      providers: action.providers
    }
  }),
  on(saveProductConfigurationsAll, (state, action) => {
    return {
      ...state,
      productsAll: action.products
    }
  }),
  on(savePlans, (state, action) => {
    var cultivos = []
    action.products.map(obj => {return obj.cultivos}).forEach(element => {
      element.forEach(cultivo => {
        if(!cultivos.includes(cultivo)){
          cultivos.push(cultivo)
        }
      });
    });

    var newPlans = state.plans ? JSON.parse(JSON.stringify(state.plans)) : []
    cultivos.forEach(element => {
      var productsFiltered = action.products.filter(obj => {return obj.cultivos.includes(element)}).map(obj => {return obj.nombre})
      var ind = newPlans.findIndex(el=>el.titulo==element+'configuration_')

      if(ind>=0){
        newPlans[ind] = {
          titulo: element+'configuration_',
          herramientas: ['histograma','curva','mapa_variable','tareas','precosecha','videos','medicion','crear_poligono','descargas','capas'],
          productos: productsFiltered,
        }
      }else{
        newPlans.push({
          titulo: element+'_configuration',
          herramientas: ['histograma','curva','mapa_variable','tareas','precosecha','videos','medicion','crear_poligono','descargas','capas'],
          productos: productsFiltered,
        })
      }
    })

    return {
      ...state,
      plans: newPlans
    }
  }),
);

export const ProductsConfigurationReducer = (state, action) => {
  return _productsConfigurationReducer(state, action);
}
