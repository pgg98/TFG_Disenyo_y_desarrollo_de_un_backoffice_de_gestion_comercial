import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { changesColumns, columnsTable } from "../commons/constants/columnsTable";
import { categories } from "../commons/enums/categories"
import { Usuario } from "../models/usuario.model";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor( private http: HttpClient) { }

  private headerJSON = new HttpHeaders({
    'Content-Type': 'application/JSON'
  })

  /**
   * Función que realiza la petición de la url que se pasa por parámetro
   * @param url url para realizar una petición
   * @param body posible filtro
   * @returns datos
   */
  getDataByUrl(url: string, body?: any, category?: number) {
    // añadir categoría al body cuando no es leads o novedades
    body = (body && category && ![categories.LEADS, categories.NOVEDADES, categories.PRODUCTS].includes(category)) ?
      { filtro: { ...body.filtro, category: category }} :
      (category && category && ![categories.LEADS, categories.NOVEDADES, categories.PRODUCTS].includes(category)) ?
      { filtro: { category: category }} : (body) ? { filtro: { ...body.filtro }} : undefined;

    return (body || category === categories.NOVEDADES || category === categories.PRODUCTS) ?
    this.http.post<any>(environment.databaseURL + url, ((category === categories.NOVEDADES || category === categories.PRODUCTS) && body) ? body.filtro : body) :
    this.http.get<any>(environment.databaseURL + url);
  }

  /**
   * Método Post de obtener url
   * @param url string a buscar
   * @param body posible body de la petición
   * @returns resultado de la petición
   */
  getDataByUrlPost(url: string, body?: any) {
    return this.http.post<any>(environment.databaseURL + url, (body && body.filtro) ? body.filtro : undefined);
  }

  /**
   * Método get de obtener url
   * @param url string a buscar
   * @returns resultado de la petición
   */
  getDataByUrlGet(url: string) {
    return this.http.get<any>(environment.databaseURL + url);
  }

  /**
   * Obtener clientes según la categoría
   * @param category
   * @param body posible filtro
   * @returns clientes
   */
  getData(category: number, body?: any, orderby?: string) {
    if(category === categories.NOVEDADES) return this.getNovedadespage((body) ? body.filtro : undefined, orderby);
    if(category === categories.PRODUCTS) return this.getProductConfigurationsPage((body) ? body.filtro : undefined, orderby)
    if(category !== categories.LEADS){
      // añadir categoría
      body = (body) ?
      { filtro: { ...body.filtro, category: category }} :
      { filtro: { category: category }};
      return this.http.post<any>(environment.databaseURL + `/rest/clientespage${(orderby) ? '/' + orderby : ''}`, body);
    }
    return (body) ?
    this.http.post<any>(environment.databaseURL + `/rest/usuarios/category/${category}/page${(orderby) ? '/' + orderby : ''}`, body) :
    this.http.get<any>(environment.databaseURL + `/rest/usuarios/category/${category}/page${(orderby) ? '/' + orderby : ''}`);
  }

  /**
   * Obtiene datos de un usuario por su nick o id siendo el qe lo demanda un superusuario
   * @param user id o nick del usaurio
   * @returns datos del usuario
   */
  getUserDetail(user: any) {
    return this.http.get(`${environment.databaseURL}/rest/super/clientes/usuarios/${user}`);
  }

  /**
   * Obtener paginación de las novedades
   * @param body
   * @returns
   */
  getNovedadesData(body?: any) {
    return this.getNovedadespage((body) ? body.filtro : undefined);
  }

  /**
   * Obtener paginación de las novedades
   * @param body
   * @returns
   */
  getProductosConfData(body?: any) {
    return this.getProductConfigurationsPage((body) ? body.filtro : undefined)
  }

  /**
   * Función que realiza la llamada para obtener los usuarios de un cliente
   * @param idCliente
   * @param body FILTRO
   * @returns usuarios del cliente
   */
  getUsers(idCliente: number, body?: any, orderby?: string) {
    // añadir al filtro el idCliente
    if(body) {
      body = {
        filtro: {
          ...body.filtro,
          fk_cliente: idCliente
        }
      }
    } else {
      body = {
        filtro: {
          fk_cliente: idCliente
        }
      }
    }
    return this.http.post<any>(environment.databaseURL + `/rest/usuariospage${(orderby) ? '/' + orderby : ''}`, body);
  }

  /**
   * Obtener superusuarios de la api
   * @returns superusuarios
   */
  getSuperusers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.databaseURL}/rest/clientes/superusers`);
  }

  /**
   * Función que obtiene la paginación de las novedades, pudiendo aplicarle un filtro
   * @param body filtro de la pag
   * @returns datos de la paginación
   */
  getNovedadespage(body?: string, orderby?: string) {
    return this.http.post<any>(`${environment.databaseURL}/rest/novedadespage${(orderby) ? '/' + orderby : ''}`, body);
  }

  /**
     * Función que obtiene la paginación de las configuraciones de los productos, pudiendo aplicarle un filtro
     * @param body filtro de la pag
     * @returns datos de la paginación
     */
  getProductConfigurationsPage(body?: string, orderby?: string) {
    return this.http.post<any>(`${environment.databaseURL}/rest/productosconfpage${(orderby) ? '/' + orderby : ''}`, body);
  }

   /**
   * Función que transforma los datos en un objeto seleccionado
   * @param datos datos que llegan de la llamada
   * @param key datos a los que hace referencia
   * @returns objeto con los datos transformados
   */
    transformDatos(datos: Object[], key: string, showUsers?: boolean, category?: number): Object[] {
      let result = datos.map(element => {
        let dato = columnsTable[key].reduce((actualData, column) => {
          if(Object.keys(element).includes(column)) {
            actualData[column] = element[column];
          } else {
            let objects = Object.keys(element).filter(a => typeof element[a] === 'object' && element[a] !== null).sort((a, b) => { return (a.includes('contacto')) ? -1 : 1});
            objects.forEach(label => {
              if(Object.keys(element[label]).includes(column) && actualData[column] === undefined && element[label][column] !== null) {
                actualData[column] = element[label][column];
              }
            })
          }
          return actualData;
        }, {});
        if(element['fk_cliente'] && element['fk_cliente']['id']) dato['id'] = element['fk_cliente']['id'];
        else if(element['id']) dato['id'] = element['id'];

        if(element['fk_provider'] && element['fk_provider']['provider']) dato['fk_provider'] = element['fk_provider']['provider']
        return dato;
      });

      // cambiar data de tabla no leads (email y phone)
      if(!showUsers && categories.LEADS !== category) {
        result = result.map((element, index) => {
          Object.entries(changesColumns).forEach(([prevKey, newKey]) => {
            element[prevKey] = datos[index][newKey];
          });
          return element;
        })
      }
      return result;
    }


  /**
   * Función que crea el body para borrar novedades
   * @param novedades novedades a borrar
   * @returns body correcto para la llamada
   */
  bodyBorrarNovedades(novedades: Object[]): Object {
    let ids: number[] = []
    novedades.forEach((element) => {
      ids.push(element['id']);
    });
    return { id__in: ids };
  }

  /**
   * Función que borra las novedades introducidas en el body
   * @param body contiene las novedades a borrar
   * @returns resultado de la acción
   */
  borrarNovedades(body: Object) {
    return this.http.delete<any>(`${environment.databaseURL}/rest/novedades`, { body: body });
  }

  /**
   * Función que manda a la api los datos de la nueva novedad
   * @param novedad datos de la nueva novedad
   * @returns resultado de la operación
   */
  crearNovedad(novedad: Object) {
    return this.http.post<any>(`${environment.databaseURL}/rest/novedades`, novedad);
  }

  /**
   * Realiza petición PUT editando la novedad definida por el id
   * @param body datos a cambiar
   * @param id de la novedad
   * @returns resultado de la acción
   */
  editarNovedad(body: Object, id: number) {
    return this.http.put<any>(`${environment.databaseURL}/rest/novedades/${id}`, body);
  }


  /** PRODUCT CONF */
  /**
   * Realiza petición PUT editando la novedad definida por el id
   * @param body datos a cambiar
   * @param id de la novedad
   * @returns resultado de la acción
   */
   getProviders() {
    return this.http.get<any>(`${environment.databaseURL}/rest/providersAll`,);
  }
  /**
   * Realiza petición PUT editando la novedad definida por el id
   * @param body datos a cambiar
   * @param id de la novedad
   * @returns resultado de la acción
   */
   saveProductConfiguration(body, id: number) {
    return this.http.put<any>(`${environment.databaseURL}/rest/productosconf/${id}`,body);
  }
}
