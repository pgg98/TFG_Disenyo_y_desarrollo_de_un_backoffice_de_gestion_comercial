import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment} from '../../environments/environment';
import { Producto } from '../interfaces/producto';
import { herramienta } from '../interfaces/herramienta.interface';
import { Area } from '../interfaces/area'
import { Observable } from 'rxjs';
import { columnsTable } from "../commons/constants/columnsTable";
import * as telData from 'country-telephone-data';
import { Parcela2 } from '../interfaces/parcela';
import { geojsonToWKT } from "@terraformer/wkt";
import { OptionsCheckUser } from '../interfaces/OptionsCheckUser.interface';
import Swal from 'sweetalert2';
import { PaginationUrlOptions } from '../commons/enums/GenerarCurvas.enum';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor( private http: HttpClient) { }

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * Función para crear los objetos de tipo Producto
   * @param productos Todos los productos
   * @param productosCliente Productos que tiene el cliente
   * @returns Array de productos
   */
  formatearProductos(productos, productosCliente):Array<Producto>{
    var productosFormateados:Array<Producto> = [];
    for (let index = 0; index < productos.length; index++) {
      var newProducto:Producto = {
        nombre: productos[index].nombre,
        agrupacion: productos[index].agrupacion,
        id: productosCliente.find(el=>el.nombre == productos[index].nombre) ? productosCliente.find(el=>el.nombre == productos[index].nombre).id : null,
        check: productosCliente.find(el=>(el.nombre == productos[index].nombre) && (el.activo)) ? true : false,
        titulo: productosCliente.find(el=>el.nombre == productos[index].nombre) ? productosCliente.find(el=>el.nombre == productos[index].nombre).titulo : productos[index].titulo,
        titulo_english: productosCliente.find(el=>el.nombre == productos[index].nombre) ? productosCliente.find(el=>el.nombre == productos[index].nombre).titulo_english : productos[index].titulo_english,
        titulo_portuguese: productosCliente.find(el=>el.nombre == productos[index].nombre) ? productosCliente.find(el=>el.nombre == productos[index].nombre).titulo_portuguese : productos[index].titulo_portuguese,
        fk_provider: productos[index].fk_provider_id,
        cultivos: productosCliente.find(el=>el.nombre == productos[index].nombre) ? productosCliente.find(el=>el.nombre == productos[index].nombre).cultivos : productos[index].cultivos,
        pixel_2: productosCliente.find(el=>el.nombre == productos[index].nombre) ? productosCliente.find(el=>el.nombre == productos[index].nombre).pixel_2 : productos[index].pixel_2,
      }

      productosFormateados.push(newProducto);
    }
    return productosFormateados;
  }

  /**
   * Función para crear las herramientas con su interfaz
   * @param herramientas array de strings con las herramientas
   * @returns array de herramientas
   */
  formatearHerramientas(herramientas, herramientasCliente):Array<herramienta>{
    var herramientasFormateados:Array<herramienta> = [];

    if(!herramientasCliente){
      herramientasCliente=[]
    }
    for (let index = 0; index < herramientas.length; index++) {
      var newHerramienta:herramienta = {
        nombre: herramientas[index].name,
        icono: herramientas[index].icon,
        check: herramientasCliente.find(el=>el==herramientas[index].name) ? true : false
      }

      herramientasFormateados.push(newHerramienta);
    }

    return herramientasFormateados;
  }

  /**
   * Función para formatear el body de las herramientas
   * @param herramientas Array de herramientas
   * @param clientData Info del cliente
   * @returns El body construido
   */
  herramientasBody(herramientas, clientData?):string{

    var herramientasFiltered = '"tools":[';
    var cent = false;

    for (let index = 0; index < herramientas.length; index++) {
      if(herramientas[index].check == true && cent == true){
        herramientasFiltered = herramientasFiltered.concat(',','"'+herramientas[index].nombre+'"');
      }

      if(herramientas[index].check == true && cent == false){
        herramientasFiltered = herramientasFiltered.concat('"'+herramientas[index].nombre+'"');
        cent=true;
      }
    }

    herramientasFiltered = herramientasFiltered.concat("]");

    // solamente se quieren editar las herramientas del cliente
    if(!clientData) return `{${herramientasFiltered}}`;

    clientData = clientData.substring(0, clientData.length - 1);

    clientData = clientData + ",";

    clientData = clientData.concat(herramientasFiltered);

    clientData = clientData + "}";

    return clientData;
  }

  crearArea(fk_cliente, area){
    return this.http.post<Area>(`${environment.databaseURL}/rest/clientes/${fk_cliente}/areas`,area,this.httpOptions);
  }

  /**
   * Función para coger todos los productos
   * @returns array de strings
   */
  getProductos(){
    return this.http.get<any[]>(`${environment.databaseURL}/rest/productosAll`,this.httpOptions);
  }

  /**
   * Función para crear el body de un producto que crea
   * @param producto Producto sobre el que se crea el body
   * @returns Devuelve el body para la petición
   */
  bodyProductoPOST(producto,language):string {
    var titulo = producto.titulo
    if(language == 'english'){
      titulo = producto.titulo_english
    }else if(language == 'portuguese'){
      titulo = producto.titulo_portuguese
    }

    var body:any = {
      nombre: producto.nombre,
      titulo: titulo,
      agrupacion: producto.agrupacion ? producto.agrupacion : "otros",
      activo: producto.check,
      fk_provider: producto.fk_provider,
      cultivos: producto.cultivos,
      pixel_2: producto.pixel_2
    }

    return JSON.stringify(body);
  }

  /**
   * Función para crear el body de un producto que modifica
   * @param activo Campo que indica si el producto está activo o no
   * @returns Devuelve el body para la petición
   */
  bodyProductoPUT(activo){
    var body = '{"activo":';

    if (activo==true) {
      body = body.concat("true");
    }else{
      body = body.concat("false");
    }

    body = body.concat("}");

    return body;
  }

  /**
   * Función que llama a las funciones que depende del producto lo crean o lo modifican para un área
   * @param productos Productos para las peticiones
   * @returns Las respuestas de las peticiones
   */
  peticionesProductos(productos,language){
    var peticiones = [];

    if (productos) {
      for (let i = 0; i < productos.length; i++) {
        for (let j = 0; j < productos[i].productos.length; j++) {
          if(productos[i].productos[j].id!=null){
            // Hago petición put
            var body = this.bodyProductoPUT(productos[i].productos[j].check);
            peticiones.push(this.editAreaProduct(productos[i].productos[j].id,body));
          }else{
            // Hago petición post
            if (productos[i].productos[j].check == true) {
              var body = this.bodyProductoPOST(productos[i].productos[j],language);
              peticiones.push(this.postAreaProduct(productos[i].area.id,body));
            }
          }
        }
      }
    }
    return peticiones;
  }

  /**
   * Función que transforma los datos en un objeto seleccionado
   * @param datos datos que llegan de la llamada
   * @param key datos a los que hace referencia
   * @returns objeto con los datos transformados
   */
   transformDatos(datos: Object[], key: string): Object[] {
    return datos.map(element => {
      let dato = columnsTable[key].reduce((actualData, column) => {
        if(Object.keys(element).includes(column)) {
          actualData[column] = element[column];
        } else {
          let objects = Object.keys(element).filter(a => typeof element[a] === 'object' && element[a] !== null).sort((a, b) => { return (a.includes('contacto')) ? -1 : 1});
          objects.forEach(label => {
            if(Object.keys(element[label]).includes(column) && actualData[column] === undefined) {
              actualData[column] = element[label][column];
            }
          })
        }
        return actualData;
      }, {});
      if(element['fk_cliente']['id']) dato['id'] = element['fk_cliente']['id'];
      return dato;
    });
  }

  /**
   * Función para formatear los errores según si necesitan csv o no y como estructurarlos
   * @param error La respuesta de la llamada que ha dado error
   * @param tipo Tipo de error que se está pasando según el formato de la variable
   * @returns Devuelve un array de errores formateados para mostrar o descargar
   */
  formatearErrores(error,tipo):any{
    var formatedError:any = '';

    if(tipo==1){
      if(error[0]){
        formatedError = error[0];
      }

      if(error.type=="FeatureCollection"){
        var arrayErrores = [];

        for (let index = 0; index < error.features.length; index++) {
          if(error.features[index].properties.errors.length > 0 && typeof error.features[index].properties.errors != 'string'){
            for (let j = 0; j < error.features[index].properties.errors.length; j++) {
              if (error.features[index].properties.id_) {
                var obj = {
                  id: error.features[index].properties.id_,
                  error: error.features[index].properties.errors[j]
                }
              }else{
                var obj = {
                  id: error.features[index].properties.id,
                  error: error.features[index].properties.errors[j]
                }
              }
              arrayErrores.push(obj);
            }
          }else{
            var obj = {
              id: error.features[index].properties.id,
              error: error.features[index].properties.errors
            }

            arrayErrores.push(obj);
          }
        }
        formatedError = this.downloadErrorsText(arrayErrores);
      }
    }else if (tipo==3) {

      var arrayErrores = [];

      for (let i = 0; i < error.length; i++) {
        if(error[i]){
          var keys = Object.keys(error[i]);
          keys.forEach((key, index)=>{
            var obj = {
              id: i,
              error: key,
              contexto: error[i][key]
            }
            arrayErrores.push(obj);
          });
        }
      }

      formatedError = this.downloadErrorsText(arrayErrores);

    }else{
      var arrayErrores = [];

      for (let i = 0; i < error.length; i++) {
        if(error[i].error){
          var keys = Object.keys(error[i].error);
          keys.forEach((key, index)=>{
            var obj = {
              id: error[i].parcela['id'],
              error: key,
              contexto: error[i].error[key]
            }
            arrayErrores.push(obj);
          });
        }else if(error[i].errors){
          for (let j = 0; j < error[i].errors.length; j++) {
            var obj2 = {
              id: error[i].id,
              error: j,
              contexto: error[i].errors[j]
            }
            arrayErrores.push(obj2);
          }
        }
      }

      formatedError = this.downloadErrorsText(arrayErrores);
    }

    return formatedError;
  }

  /**
   * Función que convierte los errores actuales a formato csv
   */
   downloadErrorsText(arrayErrores):Blob {

    let message: string = ``;

    for (var i = 0; i < arrayErrores.length; i++) {
			//construimos cabecera del csv
			if (i == 0)
      message += Object.keys(arrayErrores[i]).join(";") + "\n";
			//resto del contenido
			message += Object.keys(arrayErrores[i]).map(function(key){
        // Hay que quitarle los acentos a esta cadena pero es imposible
        return arrayErrores[i][key];
      }).join(";") + "\n";
		}

    // crear csv
    var blob = new Blob([message], {type: 'text/csv'});

    return blob;
  }

  /**
   * Función que construye la estructura del objeto parcela
   * @param data Respuesta de la petición
   * @returns Array de parcelas
   */
  buildParcelas(data){
    var parcelas:Array<Parcela2> = [];

    if(data.features){
      for (let i = 0; i < data.features.length; i++) {
        var parcela:Parcela2 = new Parcela2();
        parcela['geometry'] = geojsonToWKT(data.features[i].geometry);
        for (const property in data.features[i].properties) {
          if(parcela[property]!='zafra'){
            parcela[property] = data.features[i].properties[property];
          }else{
            if(parcela['zafra']==null){
              parcela[property] = 0;
            }
          }
        }
        parcelas.push(parcela);
      }
    }

    return parcelas;
  }

  /**
   * Función para coger todos las herramientas
   * @returns array de strings
   */
  getHerramientas(){
    return this.http.get<JSON>(`${environment.databaseURL}/rest/toolsAll`,this.httpOptions);
  }

  getAreasCliente(cliente){
    return this.http.get<JSON>(`${environment.databaseURL}/rest/clientes/${cliente}/areas`,this.httpOptions);
  }

  editUser(user_id:number,datos:string){
    return this.http.put(`${environment.databaseURL}/rest/usuarios/${user_id}`,datos,this.httpOptions);
  }

  editClient(client_id:number,datos:string){
    return this.http.put(`${environment.databaseURL}/rest/clientes/${client_id}`,datos,this.httpOptions);
  }

  getAreaProducts(area: number): Observable<any[]> {
    return this.http.get<Producto[]>(`${environment.databaseURL}/rest/areas/${area}/productos/empty_date`);
  }

  editAreaProduct(producto_id,datos){
    return this.http.put(`${environment.databaseURL}/rest/productos/${producto_id}`,datos,this.httpOptions);
  }

  /** editar areas */
  editArea(area_id: number, datos: string){
    return this.http.put(`${environment.databaseURL}/rest/areas/${area_id}`, datos, this.httpOptions);
  }

  postAreaProduct(idArea,datos){
    return this.http.post(`${environment.databaseURL}/rest/areas/${idArea}/productos`,datos,this.httpOptions);
  }

  /**
   * Pedir todas las areas de la plataforma con posibilidad de filtrar
   * @param filtros Filtros que se aplican
   * @returns Áreas filtradas
   */
  getAreasAll(filtros){
    return this.http.post(`${environment.databaseURL}/rest/areasAll`,filtros,this.httpOptions);
  }

  /**
   * Construir el body para getAreasAll (en este caso filtra solo por cultivo)
   * @param filtros Filtros para las áreas (cultivo)
   * @returns Body de la petición
   */
  formatAreasFilters(filtros){
    let formateado = `{}`;

    if(filtros.length>0) formateado = `{"cultivo":"${filtros[0]}"}`;

    return formateado;
  }

  /**
   * Función que realiza la petición de la url que se pasa por parámetro
   * @param url url para realizar una petición
   * @param body posible filtro
   * @returns datos
   */
  getCurvasOptimasPage(options: PaginationUrlOptions, body?: any){
    let { url, page, limit, orderBy } = options;
    let params = (page) ? (limit) ? (orderBy) ? `/${page}/${limit}/${orderBy}` : `/${page}/${limit}` : `/${page}` : '';
    return this.http.post<any>(`${environment.databaseURL}${(url) ? url : `/rest/curvasoptimaspage${params}`}`, body, this.httpOptions);
  }

  /**
   * Construir el body para postCurvasOptimas
   * @param curvas Curvas que quieres asignar a otro área
   * @returns Body de la petición
   */
  formatBodyAsignarCurvas(curvas){
    let formateado = [];
    let devolver;

    curvas.map(value=>{
      let aux = [];
      aux.push(value.id);
      formateado = formateado.concat(aux);
    });

    devolver = `{"curvas":[${formateado}]}`;

    return devolver;
  }

  /**
   * Asignar Curvas a otro área
   * @param idArea Id del área al que se asignan las curvas
   * @param body Body de la petición
   * @returns Número de curvas asignadas correctamente
   */
  postCurvasOptimas(idArea,body){
    return this.http.post(`${environment.databaseURL}/rest/areas/${idArea}/curvasOptimas`,body,this.httpOptions);
  }

  /**
   * Construir el body para deleteCurvasOptimas
   * @param curvas Curvas para borrar de un área
   * @returns Body de la petición
   */
  formatBodyBorrarCurvas(curvas){
    let formateado = [];
    let devolver;
    curvas.map(value=>{
      formateado.push(value.id);
    });
    devolver = `{"id":[${formateado}]}`;
    return devolver;
  }

  /**
   * Borrar curvas de un área concreta
   * @param idArea Id del área sobre la que se borran las curvas
   * @param body Body de la petición
   * @returns Nada
   */
  deleteCurvasOptimas(idArea,body){

    let jsonBorradas = {headers: new HttpHeaders({'Content-Type': 'application/json'}), body: body};

    return this.http.delete(`${environment.databaseURL}/rest/areas/${idArea}/curvasOptimas`, jsonBorradas);
  }

  /**
   * Función que pregunta a BD si existe el email o el user
   * @param options opciones de comprobación: user y email
   * @returns si ya existe el dato o no
   */
  async checkUserExists(options: OptionsCheckUser): Promise<boolean> {
    const { user, email } = options;
    let body = (user) ? { user: user } : (email) ? { email: email } : undefined;
    // no se ha enviado nada para comprobar
    if(!body) return false;
    return await this.http.post(`${environment.databaseURL}/rest/usuarios/check`, body, this.httpOptions).toPromise()
    .then(result => {
      // comprobamos resultado
      return (typeof result === 'string') ? !result.includes('no') : false;
    })
    .catch(error => { return false; })
  }

  /**
   * Función que registra un cliente en BD
   * @param user datos de usuario a registrar
   * @returns resultado de la acción
   */
  registerUser(user: Object): Observable<any> {
    return this.http.post(`${environment.databaseURL}/rest/clientes/request`, user);
  }

  postPoligono(areaId, datos, tipo){
    if (tipo==1) {
      // FILE TO GEOJSON
      return this.http.post(`${environment.databaseURL}/rest/fileToGeojson`,datos);
    }else if(tipo==2){
      // COMPARE SHAPE
      return this.http.post(`${environment.databaseURL}/rest/areas/${areaId}/compareshape`,datos);
    }else{
      return this.http.post(`${environment.databaseURL}/rest/areas/${areaId}/historicshape`,datos);
    }
  }

  sendPoligono(areaId, datos, tipo){
    if (tipo==1) {
      // BULKUPLOAD
      return this.http.post(`${environment.databaseURL}/rest/areas/${areaId}/parcelas/bulk_upload`,datos,this.httpOptions);
    }else{
      // BULKUPDATE
      return this.http.put(`${environment.databaseURL}/rest/parcelas/bulk_update`,datos,this.httpOptions);
    }
  }

  /**
   * Función que determina si un área tiene polígonos o no
   * @param areaId área a comprobar
   * @returns si tiene polígonos o no
   */
  async tienePoligonos(areaId: number): Promise<boolean> {
    const datos = {atributo:["id"], activo:true, limit:3, filtro:""};
    return await this.uniqueslimited(areaId, datos).toPromise()
    .then((result: any[]) => result && result.length > 0)
    .catch(error => false);
  }

  uniqueslimited(areaId, datos){
    return this.http.post(`${environment.databaseURL}/rest/areas/${areaId}/uniqueslimited`,datos,this.httpOptions);
  }

  uniques(areaId, datos){
    return this.http.post(`${environment.databaseURL}/rest/areas/${areaId}/uniques`,datos,this.httpOptions);
  }

  finishArea(area_id){
    return this.http.post(`${environment.databaseURL}/rest/areas/${area_id}/finished`,null)
  }

  expireClient(id: number){
    return this.http.post(`${environment.databaseURL}/rest/clientes/${id}/expire`,null)
  }

  expireArea(id: number){
    return this.http.post(`${environment.databaseURL}/rest/areas/${id}/expire`,null)
  }

  /**
   * Función que registra en la pasarela Stripe a un cliente
   * @param id del cliente a registrar en Stripe
   * @returns resultado de la acción
   */
  addToStripePayment(id: number) {
    return this.http.post<any>(`${environment.databaseURL}/rest/clientes/${id}/add_to_payment_processor/`, { });
  }

  /**
   * Función que formatea el teléfono y lo devuelve perfecto
   * @param phone telefono con formato
   * @param country_code código del país al que pertenece
   * @returns teléfono perfecto
   */
  formatPhone(phone: string, country_code: string) {
    if(phone){
      let country = telData.allCountries.find(element =>
        country_code &&
      element.iso2.toLowerCase() === country_code.toLowerCase());

      var codigo = (country) ? country.dialCode.split(',')[0] || '' : undefined;
    }

    if(codigo.length > 0){
      // encontrar el separador
      let separador = phone.split('').find(e => !/[0-9]/.test(e)) || '';
      // eliminar el separador
      phone = phone.split(separador).join('');
      // juntar con el código
      phone = '+' + codigo + phone;
    }

    return phone;
  }

  /**
   * Show dialog about not load superuser data
   */
  mensajeErrorSuperuser() : void {
    Swal.fire({
      icon: 'error',
      title: '¡Superuser no cargado!'
    })
  }
}
