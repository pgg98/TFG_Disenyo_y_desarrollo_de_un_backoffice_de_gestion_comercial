import { ApplicationModule } from "@angular/core";
import { createReducer, on, ReducerTypes } from "@ngrx/store";
import { concat } from "rxjs";
import { indicador } from "src/app/interfaces/dashboard.interface";
import { loadDashboardClientesSuccess, loadDashboardSuperficieSuccess, resetDashboardState } from "./dashboard.actions";
import { initialStateDashboard } from "./dashboard.state";


const _DashboardReducer = createReducer(
  initialStateDashboard,
  on(loadDashboardSuperficieSuccess, (state, action) => {
    var newGraficas = state.graficas ? Object.assign(state.graficas) : [];

    // juntamos los datos actuales con los nuevos que no están repetidos
    newGraficas = newGraficas.concat(action.data.filter(element => {return !newGraficas.some(dato => dato.titulo === element.titulo)}));

    // actualizamos los datos ya existentes por los nuevos
    newGraficas = newGraficas.map(element => {
      // dato nuevo
      let newElement = action.data.find(dato => dato.titulo === element.titulo);
      return (newElement) ? newElement : element;
    });

    /*for (let index = 0; index < action.data.length; index++) {
      var encontrado = newGraficas.findIndex(x => x.titulo == action.data[index].titulo);

      if(encontrado < 0){
        newGraficas = newGraficas.concat(action.data);
      }else{
        // Sustituir por la que está (reemplaza 1 elemento en el índice "encontrado")
        newGraficas.splice(encontrado, 1, action.data[index]);
      }
    }*/
    
    return {
      ...state,
      graficas: newGraficas,
    };
  }),
  on(loadDashboardClientesSuccess, (state, action) => {
    var newIndicadores = state.indicadores ? Object.assign(state.indicadores) : [];

    // juntamos los datos actuales con los nuevos que no están repetidos
    newIndicadores = newIndicadores.concat(action.data.filter(element => { return !newIndicadores.some(dato => dato.titulo === element.titulo) }));

    // actualizamos los datos ya existentes por los nuevos
    newIndicadores = newIndicadores.map(element => {
      // dato nuevo
      let newElement = action.data.find(dato => dato.titulo === element.titulo);
      return (newElement) ? newElement : element;
    });
    /*
    for (let index = 0; index < action.data.length; index++) {
      var encontrado = newIndicadores.findIndex(x => x.titulo == action.data[index].titulo);
      if(encontrado < 0){
        newIndicadores = newIndicadores.concat(action.data[index]);
      }else{
        // Sustituir por la que está (reemplaza 1 elemento en el índice "encontrado")
        newIndicadores.splice(encontrado, 1, action.data[index]);
      }
    }*/

    return {
      ...state,
      indicadores: newIndicadores,
    };

  }),
  on(resetDashboardState, (state, action) => {
    var newState = initialStateDashboard
    return {
      ...newState,
    };

  }),
);

export function DashboardReducer(state,action){
    return _DashboardReducer(state,action);
}
