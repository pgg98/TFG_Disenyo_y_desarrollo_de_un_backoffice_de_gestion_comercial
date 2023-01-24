import { createReducer, on } from "@ngrx/store";
import { herramienta } from "src/app/interfaces/herramienta.interface";
import { Producto } from "src/app/interfaces/producto";
import { clearEditorState, loadEditorProductosSucces, loadEditorHerramientasSucces, changeEditorProduct, changeEditorHerramienta, loadClientAreasSucces, createAreaSuccess, addPoligonoSuccess, uniquesLimitedSuccess, setAllProductos, saveAreaProducts, uniquesSuccess, areasAllSuccess, curvasOptimasSuccess, addBorrarCurvas, vaciarCurvas, setCurveFilter, loadingCurves } from "./editor.actions";
import { initialStateEditor } from "./editor.state";


const _EditorReducer = createReducer(
  initialStateEditor,
  on(loadEditorProductosSucces, (state, action) => {
    //copia profunda de los productos
    let newProducts = state.productos ? Object.assign([], state.productos) : []
    // no existe el área en el array de productos, ya sea por id (editar) o por titulo (nuevos)
    if(newProducts.every(el => el.area.id !== action.area.id)) {
      // no existen los productos del área
      newProducts = newProducts.concat({area: action.area, productos: action.productos})
    }
    return {
      ...state,
      productos: (newProducts.length > 0) ? newProducts : null
    };
  }),
  on(setAllProductos, (state, action) => {
    // cambiar todos los productos
    return {
      ...state,
      productos: JSON.parse(JSON.stringify(action.productos)),
    };
  }),
  on(loadEditorHerramientasSucces, (state, action) => {
    return {
      ...state,
      herramientas: action.data,
    };
  }),
  on(loadClientAreasSucces, (state, action) => {
    var areas = action.data.filter(obj =>{ return obj.nombre != 'global'})
    return {
      ...state,
      areas: areas,
    };
  }),
  on(createAreaSuccess, (state, action) => {
    var newAreas = state.areas ? Object.assign([], state.areas.concat(action.data)) : [ action.data ];
    return {
      ...state,
      areas: newAreas,
    };
  }),
  on(changeEditorProduct, (state, action) => {
    // obtenemos el indice del area
    var ind = state.productos.findIndex(el=>el.area.id == action.area)
    // obtenemos el area
    var area = state.productos.find(el=>el.area.id == action.area).area
    // hacemos una copia de los productos del area
    var newProductos =  Object.assign([],state.productos[ind].productos)
    // cambiamos el producto seleccionado
    if(newProductos){
      var newProduct: Producto = {
        nombre: action.producto.nombre,
        agrupacion: action.producto.agrupacion,
        id: action.producto.id,
        check: action.value,
        titulo: action.producto.titulo,
        titulo_english: action.producto.titulo_english,
        titulo_portuguese: action.producto.titulo_portuguese,
        fk_provider: action.producto.fk_provider,
        pixel_2: action.producto.pixel_2,
        cultivos: action.producto.cultivos
      }
      newProductos[action.index] = newProduct
    }
    // hacemos una copia del array de objetos
    var newArray = Object.assign([],state.productos)
    // cambiamos el objeto por completo
    newArray[ind] = {area: area, productos: newProductos}

    return {
      ...state,
      productos: newArray,
    };
  }),
  on(changeEditorHerramienta, (state, action) => {
    var newHerramientas =  Object.assign([], state.herramientas)
    if(newHerramientas){
        var newHerramienta: herramienta = {
          nombre: action.herramienta.nombre,
          icono: action.herramienta.icono,
          check: action.value
        }
        newHerramientas[action.index] = newHerramienta
    }

    return {
      ...state,
      herramientas: newHerramientas,
    };
  }),
  on(clearEditorState, (state, action) => {
    return initialStateEditor;
  }),
  on(addPoligonoSuccess, (state, action) => {
    return {
      ...state,
      responsePoligono: action.data,
    };
  }),
  on(uniquesLimitedSuccess, (state, action) => {
    let uniquesLimitedCopy = Object.assign([], action.data);

    return {
      ...state,
      responseUniquesLimited: uniquesLimitedCopy,
    };
  }),
  on(uniquesSuccess, (state, action) => {
    let uniquesCopy = Object.assign([], action.data);

    return {
      ...state,
      responseUniques: uniquesCopy,
    };
  }),
  on(saveAreaProducts, (state, action) => {
    let productosCopy = Object.assign([], action.productos);

    return {
      ...state,
      productosAreaAsignar: productosCopy,
    };
  }),
  on(areasAllSuccess, (state, action) => {
    let areasCopy = Object.assign([], action.areas);

    return {
      ...state,
      areasSeleccionar: areasCopy,
    };
  }),
  on(curvasOptimasSuccess, (state, action) => {
    if(action.tipo==1){
      let curvasCopy = Object.assign([], action.curvas);
      return {
        ...state,
        curvas: curvasCopy
      };
    }else if(action.tipo==2){
      let curvasCopy2 = Object.assign([], action.curvas);
      return {
        ...state,
        curvasSeleccionar: curvasCopy2,
      };
    }
  }),
  on(addBorrarCurvas, (state, action) => {
    let borrarCopy: any[] = state.curvasBorrar ? Object.assign([], state.curvasBorrar) : []
    let curvasReceived: any[] = action.curvas ? Object.assign([], action.curvas) : []

    if(curvasReceived.length == 0 && !action.add){
      // Borrar todas las curvas seleccionadas
      // borrarCopy = []
      // for (let i = 0; i < curvasReceived.length; i++) {
      //   for (let j = 0; j < borrarCopy.length; j++) {
      //     if(curvasReceived[i].id==borrarCopy[j]){}
      //   }
      // }/*  */
    }

    if(curvasReceived.length>0 && action.add){
      // Añadir curvas
      curvasReceived.forEach(element => {
        if(!borrarCopy.find(curva=>curva.id == element.id)){
          borrarCopy.push(element)
        }
      });
    }

    if(curvasReceived.length>0 && !action.add){
      // Eliminar curvas
      curvasReceived.forEach(element => {
        let index = borrarCopy.findIndex(curva=>curva.id == element.id);
        if(index>=0){
          borrarCopy.splice(index,1);
        }
      });
    }

    return {
      ...state,
      curvasBorrar: borrarCopy
    };
  }),
  on(vaciarCurvas, (state, action) => {
    return {
      ...state,
      curvasSeleccionar: null,
      curvas: null
    };
  }),
  on(setCurveFilter, (state, action) => {
    let filtroCopy = action.filter;
    return {
      ...state,
      filter: filtroCopy
    }
  }),
  on(loadingCurves, (state, action) => {
    let active = action.active;
    return {
      ...state,
      loadingCurve: active
    }
  }),
);

export function EditorReducer(state,action){
  return _EditorReducer(state,action);
}
