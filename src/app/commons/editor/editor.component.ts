import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/interfaces/producto';
import { HttpClient } from '@angular/common/http';
import { Area } from 'src/app/interfaces/area';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { clearEditorState, saveNewUser,addPoligono, addPoligonoSuccess, changeEditorHerramienta, changeEditorProduct, createArea, editAreaSuccess, editClient, editClientSuccess, editUserSuccess, finishArea, loadAreaProducts, loadClientAreas, loadEditorHerramientas, sendPoligono, uniquesLimited, loadEditorHerramientasSucces, setAllProductos, createAreaProductsSuccess, expireClient } from './state/editor.actions';
import { getAddPoligono, getAreasCliente, getEditorHerramientas, getEditorProductos, getParcelasArea } from './state/editor.selector';
import { PhoneCode } from '../../pipes/phoneCode.pipe';
import { countries } from 'countries-list';
import * as telData from 'country-telephone-data';
import { Observable, of, Subject } from 'rxjs';
import { herramienta } from 'src/app/interfaces/herramienta.interface';
import { getClientData, getLoading, getLoadingSuperusers, getMessageSuperuser } from 'src/app/pages/admin/state/admin.selector';
import { PHONECODES } from './configuration/phoneCode';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/models/usuario.model';
import { getLoginWaiting, getUser } from 'src/app/auth/state/auth.selector';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { setTitle } from 'src/app/store/share/share.actions';
import { EditorService } from 'src/app/services/editor.service';
import { ValidatorsPassword, ValidarEmail } from 'validators-password/dist/index';
import { categories } from '../enums/categories';
import { UserRegisterInterface } from 'src/app/interfaces/UserRegister.interface';
import { changeLoginWaiting, loadSuperuserTokenSuccess } from 'src/app/auth/state/auth.actions';
import { getSupersuserToken } from 'src/app/auth/state/auth.selector';
import { saveAs } from 'file-saver';
import { zafra } from 'src/app/interfaces/zafra.interface';
import { takeUntil } from 'rxjs/operators';
import { saveClientData, setLoading } from 'src/app/pages/admin/state/admin.actions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { buttonsEachTabla, columnsTable } from '../constants/columnsTable';
import { Actions, ofType } from '@ngrx/effects';
import { changesColumns } from '../constants/columnsTable';
import { PlanService } from 'src/app/services/configuration/plan.service';

import { formatDate } from '@angular/common';
import { getPlans, getProductsAll } from 'src/app/pages/admin/products_configuration/state/productsConfiguration.selector';
import { Plan } from 'src/app/interfaces/plan';
import { Token } from 'src/app/models/auth/token.model';

declare function paraEditor(): any;
declare function inputmask(): any;

export interface ProductCheckBox {
  titulo: string
  active: boolean
  nombre: string
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewChecked {
  public waiting: Observable<boolean>;
  locale:string;
  private ngUnsubscribe: Subject<any> = new Subject();

  // tabla áreas
  titleAreas: string = 'areas';
  pageAreas: number = 1;
  areasOrderedBy: string = '';
  datosArea: any[];
  tabSelected = 0;
  tab = 0;
  today = new Date(Date.now());

  loading: boolean = false;
  urlTree: any;
  type: any;
  isNew: boolean = false;

  // check usuario y email
  checkUserValue: boolean = false;
  checkEmailValue: boolean = false;
  checkTituloAreaValue: boolean = false;
  previous_email: string;

  planSelected:  string = null;
  plans: Plan[] = null

  tituloArea:string = null;
  cultivoArea:string = null;
  fin_actualizacionArea = null;

  todoForm: FormGroup;

  //valuesChanged: boolean = false;

  clientToken: boolean = false;

  languages: Object = {
    spanish: "español",
    english: "english",
    portuguese: "português"
  };

  cultivos = ['arroz', 'canha', 'soja', 'girasol', 'garbanzo', 'maiz', 'trigo', 'algodon', 'otro', 'arbol', 'nogal', 'pecano', 'represa', 'cebada', 'pastura'];

  pagos: string[] = ["Stripe", "Transferencia"/*, "Paypal"*/];
  /*intervalo_tiempo: Object = {
    MO: 'Mensual',
    AN: 'Anual'
  }*/

  codePhone = PHONECODES;

  // No creo que me hagab falta todas para el phone, repasar
  phoneCodePipe: PhoneCode = new PhoneCode();
  statusForm: number = 1;
  keysCountries: string[] = Object.keys(countries).sort((key1, key2) => countries[key1].name.localeCompare(countries[key2].name));
  keysCountriesFilter: string[] = Object.keys(countries).sort((key1, key2) => countries[key1].name.localeCompare(countries[key2].name));
  countries = countries;
  countryKeySelected: string;
  typePassword: string = 'password';
  phoneFormat: string;
  nombreEmpresa: string;
  paisSelected: string;
  ha_empresa: number;
  cultivo: string;
  separador: string;
  proveForm: boolean = false;
  validators: Object;
  checkForm: boolean = false;
  requiredCheck: boolean = false;

  clickButton: boolean = false;

  abc: string[] = [];

  changeCategory: boolean = false;

  clienteGET;
  clienteInfo;
  areasGET: Observable<Area[]>
  areasGET2: any
  public productosGET: {area: Area, productos: Producto[]}[] = null
  productosSelected: Producto[]
  public herramientasGET: herramienta[];

  areaSelected: number = null;

  user: Observable<Usuario>;

  // POLIGONOS
  zafraActual:boolean = false;
  actual:zafra = {
    nombre: "ZafraActual",
    apodo: "ZafraActual",
    csv: false,
    zip: false,
    errores: false,
    send: false,
    tipo: "shapefile",
    addCompare: "añadir",
    poligonos: 0,
    hectareas: 0
  }
  zafras:Array<zafra> = [];
  optZafra = ["shapefile","kml"];
  addCompare = ["añadir","sustituir area completa","sustituir shape"];
  csvSubido = false;
  zipSubido = false;
  tipoSubida = "shapefile";
  nombreZafraActual = "";
  tipoBoton = 0;
  files: any = [] //archivo subido (capa)
  selection: number = null // 0: Dibujar polígonos, 1: Eliminar polígonos, 2: KML+CSV, 3: SHAPE + CSV, 4: SHAPE
  fileError:File;
  contZafras = 0;
  contZafrasRest;
  areaZafra:Area = null;
  enviar = false;
  zafraTemporal;
  tipoTemporal;
  indiceTemporal;
  erroresActual;
  finish=false;
  dialogEditArea: MatDialogRef<EditAreaComponent>;
  copyHerramientas = null;
  copyProductos = null;
  superuserToken: Token | null = null;
  loadingSuperuserToken: boolean = false;
  messageSuper: Observable<string | null>;

  buttonsArea = buttonsEachTabla['areas']

  productsConfigurations: any[] = null

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private actions: Actions,
    public dialog: MatDialog,
    private editorService: EditorService,
    public planService: PlanService
  ) {
    if(router){
      this.urlTree = this.router.parseUrl(this.router.url);
      this.type = this.urlTree.queryParams['type'];
      if(![categories.CLIENTES, categories.DEMOS, categories.BAJAS, categories.LEADS].includes(parseInt(this.type))) router.navigateByUrl('/admin');
      // se indica que es el formulario de creación con la variable nuevo = 'true'
      this.isNew = this.urlTree.queryParams['nuevo'] === 'true';
      // salimos de la página si se pasa que es nuevo y no son las categorías adecuadas
      if(this.isNew && ![categories.CLIENTES, categories.DEMOS].includes(parseInt(this.type))) router.navigateByUrl('/admin');
    }
  }

  ngOnInit(): void {
    this.waiting = this.store.select(getLoginWaiting);
    //this.user = this.store.select(getUser);
    if(this.isNew) {
      // cambiar título de la página
      this.store.dispatch(setTitle({ title: `Crear ${(parseInt(this.type) === categories.DEMOS) ? 'demo' : 'cliente'}` }));
    }
    //this.areaZafra = null;

    this.store.dispatch(setLoading({ loading: true }));

    this.user = this.store.select(getUser).pipe(takeUntil(this.ngUnsubscribe));

    /**
     * Obtener el valor de cargar cualquier cosa
     */
     this.store.select(getLoading)
     .pipe(takeUntil(this.ngUnsubscribe))
     .subscribe(
       value => {
         this.loading = value;
       }
     )

     this.messageSuper = this.store.select(getMessageSuperuser);

     this.store.select(getLoadingSuperusers)
     .pipe(takeUntil(this.ngUnsubscribe))
     .subscribe(
       value => {
         this.loadingSuperuserToken = value;
       }
     )
     /**
      * Obtener el valor actual del token del superusuario
      */
     this.store.select(getSupersuserToken)
     .pipe(takeUntil(this.ngUnsubscribe))
     .subscribe(
       value => {
        this.superuserToken = value;

         // si es null es que está en proceso de obtenerlo, si no, se ha terminado
         (value === null) ?
         this.store.dispatch(setLoading({ loading: true })) :
         this.store.dispatch(setLoading({ loading: false }))
       }
     )

     this.actions.pipe(
      ofType(editUserSuccess, editClientSuccess),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      value => {
        const { category, result, isNew } = value;
        var data = value['data'];
        if(result) {
          if(!isNew) {
            if(this.tabSelected === 1) {
              // cambiar las herramientas a las nuevas cambiadas
              this.copyHerramientas = this.herramientasGET;
            }
            if(this.tabSelected === 0) {
              // cambiar nuevos datos del cliente
              var cliente = this.transformDatos(data, 'editar');
              // obtener ids adecuados
              cliente['id'] = this.clienteInfo['id'];
              cliente['userId'] = this.clienteInfo['userId'];
              this.store.dispatch(saveClientData({cliente}));
              Swal.fire({
                icon: 'success',
                title: 'Datos enviados correctamente',
                showConfirmButton: false,
                timer: 2000
              })
              return;
            }
            if(category === 3) {
              if (this.changeCategory) {
                this.changeCategory = false;
                // Aquí hacemos la redirección al editor de Cliente
                const id = data.userId;

                // cargar token del superusuario a editar
                // this.store.dispatch(loadSuperuserToken({ id: id }));

                // seguridad de implementacion
                // let cliente = this.editorService.transformDatos([client], 'editar')[0];

                var cliente = this.transformDatos(data, 'editar');
                // obtener ids adecuados
                cliente['id'] = this.clienteInfo['id'];
                cliente['idUser'] = this.clienteInfo['idUser'];
                // Aquí va el dispatch para guardar en el state el cliente
                this.store.dispatch(saveClientData({cliente}));
                Swal.fire({
                  icon: 'success',
                  title: '¡Cliente actualizado!',
                  showConfirmButton: false,
                  timer: 2000
                })
                this.router.navigateByUrl('/admin/clientes/cliente?type=3');
              }
            } else if(category === 4) {
              Swal.fire({
                icon: 'success',
                title: '¡Cliente actualizado!',
                showConfirmButton: false,
                timer: 2000
              })
              this.router.navigateByUrl('/admin/bajas');
            }
        } else {
          if(!isNew && this.tabSelected === 0) {
            Swal.fire({
              // position: 'top-end',
              icon: 'error',
              title: 'Error al enviar los datos',
              text: 'Algunos datos no se han actualizado correctamente',
              showConfirmButton: true
            });
          }
        }
      }}
    );

    this.actions.pipe(
      ofType(editAreaSuccess),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      value => {
        const { result } = value;
        if(result) {
          Swal.fire({
            icon: 'success',
            title: `Área editada`,
            timer: 4000
          }).then((value) => {
            this.dialogEditArea.close();
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Área no editada',
            text: 'Compruebe los datos',
            timer: 4000
          })
        }
      }
    )


    this.actions.pipe(
      ofType(createAreaProductsSuccess),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
      value => {
        const { result } = value;
        if(result) {
          // copiar los nuevos productos
          this.copyProductos = this.productosGET;
        }
      }
    )

    // Obtenemos la info del cliente
    this.store.select(getClientData)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data) => {
      this.clienteInfo = data;
      // Obtenemos las áreas del cliente
      if (data) {
        if(this.isNew) {
          //this.store.dispatch(loadSuperuserToken({ id: data.id }));
          this.editorService.editClient(data.id, JSON.stringify({fk_cliente: { category: parseInt(this.type) }}));
        }
        // si hay datos es que no es nuevo
        this.isNew = false;
        this.clickButton = false;
        this.clienteInfo = data;
        /** inicialización de las variables de mongo */
        //this.intializeMongoListeners()
        // nos quedamos con el email de ahora del usuario
        this.previous_email = this.clienteInfo.email;
        this.store.dispatch(loadClientAreas({ clientId: this.clienteInfo.id }));
        // Pedimos las herramientas
        this.store.dispatch(loadEditorHerramientas({data: this.clienteInfo.tools}));
        // Inicializamos los forms necesarios
        this.inicializarForms();
      } else if(this.isNew) {
        this.store.dispatch(loadEditorHerramientas({data: []}));
        // Inicializamos los forms necesarios
        this.inicializarForms();
      } else {
        if(!data){
          switch (this.type) {
            case "1":
              this.router.navigate([`../admin/leads`]);
              break;
            case "2":
              this.router.navigate([`../admin/demos`]);
              break;
            case "3":

              if(this.changeCategory!=true){
                this.router.navigate([`../admin/clientes`]);
                this.changeCategory = false;
              }

              break;
            case "4":
              this.router.navigate([`../admin/bajas`]);
              break;
            default:
              break;
          }
        }
      } // no hay nada que hacer aquí
    });

    // Funciones para aplicar las funcionalidades a los inputs especiales
    paraEditor();
    inputmask();

    // Escuchamos a las areas
    this.areasGET = this.store.select(getAreasCliente).pipe(takeUntil(this.ngUnsubscribe));
    this.store.select(getAreasCliente)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(async (value) => {
      this.areasGET2 = value;
      // set info actual area in polygons
      if(this.areaZafra) this.areaZafra = value.find(element => element.id === this.areaZafra.id);
      this.areasGET = of(value);
      // datos a mostrar en la tabla de áreas
      this.datosArea = value;
      if(this.datosArea) {
        this.datosArea = await Promise.all(
          this.datosArea.map(async (element) => {
            let result = await this.editorService.tienePoligonos(element.id);
            return { ...element, tienePoligonos: result }
          })
        );
      }
      this.changeOrderedAreasBy(this.areasOrderedBy);
      this.store.dispatch(setLoading({ loading: false }));
    });

    // Escuchamos a los productos
    this.store.select(getEditorProductos)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.productosGET = value;
      if(this.productosGET){

        // Rellenamos el vector de letras (agrupaciones)
        this.abc = [...new Set(this.productosGET[0].productos.map(x => { return x.agrupacion; }))];

        if(this.areaSelected){
          var productosFound = this.productosGET.find(el => el.area.id == this.areaSelected)
          if(productosFound){
            this.productosSelected = productosFound.productos
          }
        }
      }
      // guardar copia de los productos iniciales
      if(value && (this.copyProductos === null || this.copyProductos.length !== value.length)) {
        this.copyProductos = (this.copyProductos === null) ? JSON.parse(JSON.stringify(value)) :
        JSON.parse(JSON.stringify(this.copyProductos.concat(value.filter(element => !this.copyProductos.some(areas => areas.area.id === element.area.id)))));
      }
    })

    //Escuchamos a las herramientas
    this.store.select(getEditorHerramientas).pipe(takeUntil(this.ngUnsubscribe)).subscribe(value=>{
      this.herramientasGET = value;
      if(this.copyHerramientas === null) this.copyHerramientas = value;
    })
    //Para cambiar el poligono
    this.store.select(getAddPoligono).pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      if(value){
        this.modificaZafra(value);
      }
    });

    //Para saber si terminar disabled o enabled
    this.store.select(getParcelasArea)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      if(value){
        this.terminado(value);
      }
    });

    //Para saber si terminar disabled o enabled
    this.store.select(getProductsAll)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.productsConfigurations = value
    });

    //Para saber si terminar disabled o enabled
    this.store.select(getPlans)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.plans = value
    });
  }

  ngAfterViewChecked(): void {
    let danger = document.getElementById('buttonDanger');
    let success = document.getElementById('buttonSuccess');
    if(danger || success) {
      setTimeout(() => {
        if(danger) danger.hidden = true;
        if(success) success.hidden = true;
      }, 5000);
    }
  }

  intializeMongoListeners(){
    //this.store.dispatch(getMongoClient({client: this.clienteInfo.id}))
  }

  /**
   * Función que transforma los datos en un objeto seleccionado
   * @param datos datos que llegan de la llamada
   * @param key datos a los que hace referencia
   * @returns objeto con los datos transformados
   */
   transformDatos(datos: Object, key: string): Object[] {
      let dato = columnsTable[key].reduce((actualData, column) => {
        if(Object.keys(datos).includes(column)) {
          actualData[column] = datos[column];
        } else {
          let objects = Object.keys(datos).filter(a => typeof datos[a] === 'object' && datos[a] !== null).sort((a, b) => { return (a.includes('contacto')) ? -1 : 1});
          objects.forEach(label => {
            if(Object.keys(datos[label]).includes(column) && actualData[column] === undefined && datos[label][column] !== null) {
              actualData[column] = datos[label][column];
            }
          })
        }
        return actualData;
      }, {});
      if(datos['id']) dato['id'] = datos['id'];
      return dato;
  }

  /** GENERAL */

  /**
   * Función que lanza el dispatch cuando un área está a false (es nueva) para mandarla a procesar
   */
  terminarPoligono(){
    this.store.dispatch(finishArea({areaId: this.areaZafra.id, clienteId: this.clienteInfo.id}));
  }

  /**
   * Función que sirve para poner a true la variable que controla si un área está terminada y poner enabled el botón
   * @param response respuesta de la petición
   */
  terminado(response){
    if(response.length>0){
      this.finish=true;
    }
  }

  /**
   * Función que resetea las variables necesarias para devolver una zafra a su estado original
   * @param type el tipo de reseteo según sea completo o parcial
   * @param zafra la zafra a resetear
   */
  restartVariables(type,zafra){

    if(zafra.nombre=="ZafraActual"){
      // Restart zafra actual
      if (type==3) {
        this.actual = {
          nombre: "ZafraActual",
          csv: false,
          zip: false,
          errores: false,
          send: false,
          tipo: this.actual.tipo,
          addCompare: this.actual.addCompare,
          form: null,
          idcsv: this.actual.idcsv,
          idzip: this.actual.idzip,
          apodo: "ZafraActual",
          poligonos: this.actual.poligonos,
          hectareas: this.actual.hectareas
        }
      }else if(type==4){
        this.actual = {
          nombre: "ZafraActual",
          csv: false,
          zip: false,
          errores: this.actual.errores,
          send: this.actual.send,
          tipo: this.actual.tipo,
          addCompare: this.actual.addCompare,
          form: this.actual.form,
          idcsv: null,
          idzip: null,
          apodo: "ZafraActual",
          poligonos: this.actual.poligonos,
          hectareas: this.actual.hectareas
        }
      }else{
        this.actual = {
          nombre: "ZafraActual",
          csv: false,
          zip: false,
          errores: false,
          send: false,
          tipo: "shapefile",
          addCompare: "añadir",
          form: null,
          idcsv: this.actual.idcsv,
          idzip: this.actual.idzip,
          apodo: "ZafraActual",
          poligonos: this.actual.poligonos,
          hectareas: this.actual.hectareas
        }
      }

      this.enviar = false;
    }else{
      var index = zafra.nombre.substr(-1);
      if (type==3) {
        this.zafras[index] = {
          nombre: this.zafras[index].nombre,
          csv: false,
          zip: false,
          errores: false,
          send: false,
          tipo: this.zafras[index].tipo,
          addCompare: this.zafras[index].addCompare,
          form: null,
          idcsv: this.zafras[index].idcsv,
          idzip: this.zafras[index].idzip,
          apodo: this.zafras[index].nombre,
          historico: false
        }
      }else{
        this.zafras[index] = {
          nombre: this.zafras[index].nombre,
          csv: false,
          zip: false,
          errores: false,
          send: false,
          tipo: "shapefile",
          addCompare: "añadir",
          form: null,
          idcsv: this.zafras[index].idcsv,
          idzip: this.zafras[index].idzip,
          apodo: this.zafras[index].nombre,
          historico: false
        }
      }
    }

    this.files = [];

  }

  /**
   * Función para resetear todas las zafras al cambiar de área en el selector de áreas
   */
  restart(){
    this.finish = false;

    // Restart zafra actual
    this.actual = {
      nombre: "ZafraActual",
      csv: false,
      zip: false,
      errores: false,
      send: false,
      tipo: "shapefile",
      addCompare: "añadir",
      form: null,
      idcsv: this.actual.idcsv,
      idzip: this.actual.idzip,
      apodo: "ZafraActual",
      poligonos: this.actual.poligonos,
      hectareas: this.actual.hectareas
    }

    this.enviar = false;

    this.zafras = [];

    this.contZafras = 0;

  }

  /**
   * Función que modifica cada zafra que cambia al hacer un dispatch, como por ejemplo cuando hay errores
   * @param value response de la petición
   */
  modificaZafra(value){

    if (value.tipo) {
      if(value.tipo == 1){
        if (this.tipoTemporal==1) {

          this.actual = {
            nombre: this.actual.nombre,
            csv: this.actual.csv,
            zip: this.actual.zip,
            errores: false,
            send: this.actual.send,
            tipo: this.actual.tipo,
            addCompare: this.actual.addCompare,
            response: value.response,
            idcsv: this.actual.idcsv,
            idzip: this.actual.idzip,
            apodo: this.actual.apodo,
            poligonos: value.response.length
          }

          this.enviar = true;

        }else{
          this.zafras[this.indiceTemporal] = {
            nombre: this.zafraTemporal.nombre,
            csv: false,
            zip: false,
            errores: false,
            send: this.zafraTemporal.send,
            tipo: this.zafraTemporal.tipo,
            addCompare: this.zafraTemporal.addCompare,
            idcsv: this.zafraTemporal.idcsv,
            idzip: this.zafraTemporal.idzip,
            apodo: this.zafraTemporal.apodo,
            historico: true
          }
        }

      }

      if(value.tipo == 3){

        // this.erroresActual = value.response;

        if (this.tipoTemporal==1) {
          this.actual = {
            nombre: this.actual.nombre,
            csv: false,
            zip: false,
            errores: true,
            send: this.actual.send,
            tipo: this.actual.tipo,
            addCompare: this.actual.addCompare,
            idcsv: this.actual.idcsv,
            idzip: this.actual.idzip,
            error: value.response,
            apodo: this.actual.apodo
          }
        }else{
          this.zafras[this.indiceTemporal] = {
            nombre: this.zafraTemporal.nombre,
            csv: false,
            zip: false,
            errores: true,
            send: this.zafraTemporal.send,
            tipo: this.zafraTemporal.tipo,
            addCompare: this.zafraTemporal.addCompare,
            idcsv: this.zafraTemporal.idcsv,
            idzip: this.zafraTemporal.idzip,
            error: value.response,
            apodo: this.zafraTemporal.apodo,
            historico: this.zafraTemporal.historico
          }
        }

      }
    }

    // Aqui llamar a addPoligonSucces con null para reiniciar el estado
    this.store.dispatch(addPoligonoSuccess(null));

  }

  /**
   * Función para realizar las peticiones de la zafra actual después de procesarla para enviarla (paso 2)
   */
  enviarPoligono(){
    // ZAFRA ACTUAL
    if(this.areaZafra && this.areaZafra.terminado==false){

      // BULKUPLOAD
      this.store.dispatch(sendPoligono({ areaId: this.areaZafra.id, datos: this.actual.response, tipo: 1, clientID: this.clienteInfo.id, addCompare: this.actual.addCompare }));
    }else{

      // BULKUPDATE
      this.store.dispatch(sendPoligono({ areaId: this.areaZafra.id, datos: this.actual.response, tipo: 2, clientID: this.clienteInfo.id, addCompare: this.actual.addCompare }));
    }
  }

  /**
   * Función para realizar las peticiones para procesar las zafras
   * @param zafra zafra que procesar
   * @param type tipo según si es la zafra actual o una creada de forma dinámica
   * @param index índice para el array de las zafras dinámicas
   */
  sendPoligonos(zafra,type,index?){

    if (type==1) {
      // ZAFRA ACTUAL
      if(this.areaZafra && this.areaZafra.terminado==false){
        this.zafraTemporal = zafra;
        this.indiceTemporal = index;
        this.tipoTemporal = type;

        // FILE TO GEOJSON
        this.store.dispatch(addPoligono({ areaId: this.areaZafra.id, form: zafra.form, tipo: 1 }));
      }else{
        this.zafraTemporal = zafra;
        this.indiceTemporal = index;
        this.tipoTemporal = type;

        // COMPARE SHAPE
        this.store.dispatch(addPoligono({ areaId: this.areaZafra.id, form: zafra.form, tipo: 2 }));
      }
    }

    if(type==2){
      // ZAFRAS DINÁMICAS

      this.zafraTemporal = zafra;
      this.indiceTemporal = index;
      this.tipoTemporal = type;

      this.store.dispatch(addPoligono({ areaId: this.areaZafra.id, form: zafra.form, tipo: 3 }));
    }

  }

  /**
   * Función que descarga automáticamente un archivo de errores
   */
  downloadErrors(zafra){
    saveAs(zafra.error, `detallesErrores.csv`);
  }

  /**
   * Función que gestiona la subida de un archivo (capa), ya sea kml o shape
   * @param event archivo
   * @param type si es kml o shape (hay que diferenciarlo en la API)
   */
   onFileInput(event, fileType, zafra){

    if(zafra.nombre=='ZafraActual'){
      this.actual = {
        nombre: this.actual.nombre,
        csv: this.actual.csv,
        zip: this.actual.zip,
        errores: false,
        send: this.actual.send,
        tipo: this.actual.tipo,
        addCompare: this.actual.addCompare,
        idcsv: this.actual.idcsv,
        idzip: this.actual.idzip,
        apodo: this.actual.apodo
      }
    }else{
      var index = zafra.nombre.substr(-1);
      this.zafras[index] = {
        nombre: this.zafras[index].nombre,
        csv: this.zafras[index].csv,
        zip: this.zafras[index].zip,
        errores: false,
        send: this.zafras[index].send,
        tipo: this.zafras[index].tipo,
        addCompare: this.zafras[index].addCompare,
        idcsv: this.zafras[index].idcsv,
        idzip: this.zafras[index].idzip,
        apodo: this.zafras[index].apodo,
        historico: this.zafras[index].historico
      }
    }

    const file: File = event.target.files[0];

    //Obtenemos las variables locales de título y archivo
    var ind = this.files.findIndex(el=>el.type == fileType)
    if(ind>=0){
      this.files[ind]={file: file, type: fileType, title: file.name.split('.')[0]}
    }else{
      this.files.push({file: file, type: fileType, title: file.name.split('.')[0]})
    }
    // this.changeSelectionButtons(this.selection)
    this.check2send(this.files, this.selection, zafra)
  }

  /**
   * Función que comprueba si están todos los archivos para añadir la capa y visualizar los polígonos
   * @param files
   * @param selection
   */
   check2send(files,selection,zafra){

    var csv = files.find(el=>el.type=='csv')
    var zip = files.find(el=>el.type=='zip')
    var form = new FormData();

    if(csv!=undefined){

      form.append("csv", csv.file);

      if(zafra.nombre=='ZafraActual'){
        this.actual = {
          nombre: this.actual.nombre,
          csv: true,
          zip: this.actual.zip,
          errores: this.actual.errores,
          send: this.actual.send,
          tipo: this.actual.tipo,
          addCompare: this.actual.addCompare,
          idcsv: this.actual.idcsv,
          idzip: this.actual.idzip,
          csvFile: csv.file,
          zipFile: this.actual.zipFile,
          apodo: this.actual.apodo
        }
      }else{
        var index = zafra.nombre.substr(-1);
        this.zafras[index] = {
          nombre: this.zafras[index].nombre,
          csv: true,
          zip: this.zafras[index].zip,
          errores: this.zafras[index].errores,
          send: this.zafras[index].send,
          tipo: this.zafras[index].tipo,
          addCompare: this.zafras[index].addCompare,
          idcsv: this.zafras[index].idcsv,
          idzip: this.zafras[index].idzip,
          csvFile: csv.file,
          zipFile: this.zafras[index].zipFile,
          apodo: this.zafras[index].apodo,
          historico: this.zafras[index].historico
        }
      }
    }else{
      if(zafra.csvFile){
        form.append("csv", zafra.csvFile);
      }
    }

    if(zip!=undefined){
      form.append(zafra.tipo, zip.file);
      if(zafra.nombre=='ZafraActual'){
        this.actual = {
          nombre: this.actual.nombre,
          csv: this.actual.csv,
          zip: true,
          errores: this.actual.errores,
          send: this.actual.send,
          tipo: this.actual.tipo,
          addCompare: this.actual.addCompare,
          idcsv: this.actual.idcsv,
          idzip: this.actual.idzip,
          zipFile: zip.file,
          csvFile: this.actual.csvFile,
          apodo: zip.file.name
        }
      }else{
        var index = zafra.nombre.substr(-1);
        this.zafras[index] = {
          nombre: this.zafras[index].nombre,
          csv: this.zafras[index].csv,
          zip: true,
          errores: this.zafras[index].errores,
          send: this.zafras[index].send,
          tipo: this.zafras[index].tipo,
          addCompare: this.zafras[index].addCompare,
          idcsv: this.zafras[index].idcsv,
          idzip: this.zafras[index].idzip,
          zipFile: zip.file,
          csvFile: this.zafras[index].csvFile,
          apodo: zip.file.name,
          historico: this.zafras[index].historico
        }
      }
    }else{
      if(zafra.zipFile){
        form.append(zafra.tipo, zafra.zipFile);
      }
    }

    if(zafra.nombre=='ZafraActual'){
      this.actual = {
        nombre: this.actual.nombre,
        csv: this.actual.csv,
        zip: this.actual.zip,
        errores: this.actual.errores,
        send: this.actual.send,
        tipo: this.actual.tipo,
        addCompare: this.actual.addCompare,
        form: form,
        idcsv: this.actual.idcsv,
        idzip: this.actual.idzip,
        zipFile: this.actual.zipFile,
        csvFile: this.actual.csvFile,
        apodo: this.actual.apodo
      }
    }else{
      var index = zafra.nombre.substr(-1);
      this.zafras[index] = {
        nombre: this.zafras[index].nombre,
        csv: this.zafras[index].csv,
        zip: this.zafras[index].zip,
        errores: this.zafras[index].errores,
        send: this.zafras[index].send,
        tipo: this.zafras[index].tipo,
        addCompare: this.zafras[index].addCompare,
        form: form,
        idcsv: this.zafras[index].idcsv,
        idzip: this.zafras[index].idzip,
        zipFile: this.zafras[index].zipFile,
        csvFile: this.zafras[index].csvFile,
        apodo: this.zafras[index].apodo,
        historico: this.zafras[index].historico
      }
    }

    this.files = [];

  }

  /**
   * Función que comprueba si un área tiene polígonos
   */
  showArea(){
    var body = {atributo:["id"],activo:true,limit:3,filtro:""};

    if(this.areaZafra){
      this.store.dispatch(uniquesLimited({areaId:this.areaZafra.id,datos:JSON.stringify(body)}));
    }
  }

  /**
   * Función para controlar el cambio de tab
   * @param evt evento
   */
  async onTabChange(evt) {
    // Esto sirve para que se aplique el estilo a los selectores
    // paraEditor();
    if(evt.index !== this.tabSelected && [0, 1, 3].includes(this.tabSelected)) {
      if(this.tabSelected === 1 && this.isHerramientasChanged() ||
      this.tabSelected === 3 && this.isProductosChanged() ||
      this.tabSelected === 0 && this.isDataFormChanged()) {
        return await Swal.fire({
          title: 'Cambios sin guardar',
          text: "¿Pasar la página sin guardar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            if(this.tabSelected === 1) {
              this.store.dispatch(loadEditorHerramientasSucces({ data: this.copyHerramientas }));
            }
            if(this.tabSelected === 3) {
              this.store.dispatch(setAllProductos({ productos: this.copyProductos }));
            }
            if(this.tabSelected === 0) {
              this.inicializarForms();
            }
            this.tabSelected = evt.index;
            this.planSelected = null;
            this.tab = evt.index;
          } else {
            this.tab = this.tabSelected;
          }
        })
      } else {
        this.tabSelected = evt.index;
        this.tab = evt.index;
      }
    } else {
      this.tabSelected = evt.index;
      this.tab = evt.index;
    }
  }

  /**
   * Función que recibe el evento de editar la fila de área
   */
  editArea(area): void {
    if((!this.isNew && this.superuserToken === null) || this.loadingSuperuserToken) {
      this.editorService.mensajeErrorSuperuser();
      return;
    }
    this.dialogEditArea = this.dialog.open(EditAreaComponent, {
      disableClose: true,
      data : { ...area, clientId: this.clienteInfo.id }
    });
  }

  /**
   * Fución que escucha el evento de terminar
   * @param id id del área a terminar
   */
  terminarArea(id: number): void {
    if(this.superuserToken !== null) {
      this.store.dispatch(finishArea({ areaId: id, clienteId: this.clienteInfo.id }));
      return;
    }
    this.editorService.mensajeErrorSuperuser();
  }

  /**
   * Función que cambia el orden de las filas del area según la columna
   */
  changeOrderedAreasBy(column: string) {
    const copyDatos = (this.datosArea) ? [ ...this.datosArea ] : [];
    if(column.length > 0) {
      const normalColumn = column.replace('-', '');
      this.datosArea = copyDatos.sort((a, b) => {
          if(!a[normalColumn] && typeof a[normalColumn] !== 'boolean') return 1;
          if(!b[normalColumn] && typeof b[normalColumn] !== 'boolean')  return -1;
          return (column.startsWith('-')) ?
          // se ordena de mayor a menor
          (b[normalColumn] + '').localeCompare(a[normalColumn]) :
          // se ordena de menor a mayor
          (a[normalColumn] + '').localeCompare(b[normalColumn]);
      });
    }
  }

  /**
   * Función para controlar el evento de los radio buttons y cambiar el valor en el formulario
   * @param evt evento que llega del input
   * @param id identificador del radio button que llama a la función
   */
  getNewProducts() {
    // buscamos los productos del área seleccionada
    var productosFound = this.productosGET.find(el=>el.area.id === this.areaSelected);
    this.productosSelected = (productosFound) ? productosFound.productos : undefined;
  }

  /**
   * Función que inicializa los forms que haya segń el tipo de formulario
   */
  inicializarForms(){
    if(categories.LEADS == parseInt(this.type)) {
      var phone_selected = (!this.isNew) ? this.check_extension_phone(this.clienteInfo.phone) : { phone_option: '', number: ''};
    }

    let personalDataForm = this.formBuilder.group({
      nombre: [(this.clienteInfo) ? (this.clienteInfo.nombre) ? this.clienteInfo.nombre : '' : '', [Validators.required]],
      apellidos: [(this.clienteInfo) ? (this.clienteInfo.apellidos) ? this.clienteInfo.apellidos : '' : '', [Validators.required]],
      pais: [(this.clienteInfo) ? (this.clienteInfo.pais) ? this.clienteInfo.pais : null : null, [Validators.required]],
      email: [(this.clienteInfo) ? (this.clienteInfo.email) ? this.clienteInfo.email : '' : '', [Validators.required, ValidarEmail.validarEmail]],
      codePhone: [(phone_selected) ? phone_selected.phone_option : null, [Validators.required]],
      inputFilter: [''],
      phone: [(phone_selected) ? phone_selected.number : null, [Validators.required]],
      cultivo: [(this.clienteInfo) ? (this.clienteInfo.cultivo) ? this.clienteInfo.cultivo : null : null, [Validators.required]]
    });
    // controles necesarios para cuando es nuevo
    let formNewUser = this.formBuilder.group({
      user: (this.isNew) ? ['', [Validators.required]] : undefined,
      password: (this.isNew) ? ['', [Validators.required, Validators.minLength(8), ValidatorsPassword.contieneCaracter, ValidatorsPassword.contieneCaracteresEspeciales,
      ValidatorsPassword.contieneDigito, ValidatorsPassword.contieneMayuscula]] : undefined
    });

    //controles necesarios cuando es EDITAR tipo 2 = DEMOS
    let formType2 = this.formBuilder.group({
      fin_plataforma: [(this.clienteInfo) ? (this.clienteInfo.fin_plataforma) ? this.clienteInfo.fin_plataforma : '' : '', [Validators.required]],
      fin_actualizacion: [(this.clienteInfo) ? (this.clienteInfo.fin_actualizacion) ? this.clienteInfo.fin_actualizacion : '' : '', [Validators.required]],
    });

    //controles necesarios cuando es EDITAR tipo 3 = CLIENTES
    let formType3 = this.formBuilder.group({
      metodo_pago: [(this.clienteInfo) ? (this.clienteInfo.metodo_pago) ? this.clienteInfo.metodo_pago : null : null, [Validators.required]],
      //interval: [(this.clienteInfo) ? (this.clienteInfo.interval) ? this.clienteInfo.interval : null : null, [Validators.required]],
      //price: [(this.clienteInfo) ? (this.clienteInfo.price) ? this.clienteInfo.price : null : null, [Validators.required]],
      ha_contrat: [(this.clienteInfo) ? (this.clienteInfo.ha_contrat || this.clienteInfo.ha_contrat === 0) ? this.clienteInfo.ha_contrat : null : null, (this.clienteInfo && this.clienteInfo.alta_freq) ? [Validators.required] : []],
      ha_contrat_sent: [(this.clienteInfo) ? (this.clienteInfo.ha_contrat_sent || this.clienteInfo.ha_contrat_sent === 0) ? this.clienteInfo.ha_contrat_sent : null : null, [Validators.required]],
    });

    // form general
    this.todoForm = this.formBuilder.group({
      //cultivo: [(this.clienteInfo) ? (this.clienteInfo.cultivo) ? this.clienteInfo.cultivo : null : null, [Validators.required]],
      ha_empresa: [(this.clienteInfo) ? (this.clienteInfo.ha_empresa) ? this.clienteInfo.ha_empresa : '' : '', [Validators.required]],
      empresa: [(this.clienteInfo) ? (this.clienteInfo.empresa) ? this.clienteInfo.empresa : '' : '', [Validators.required]],
      verificado: [(this.clienteInfo) ? (this.clienteInfo.verificado) ? this.clienteInfo.verificado : false : false/*, disabled: true*/ ],
      contactado: [(this.clienteInfo) ? (this.clienteInfo.contactado) ? this.clienteInfo.contactado : false : false],
      /*fecha_registro: [{value: (this.isNew) ? new Date(Date.now()) : (this.clienteInfo && this.clienteInfo.fecha_registro) ? this.clienteInfo.fecha_registro :
        new Date("July 1 1970"), disabled: true}, [Validators.required]],*/
      alta_freq: [(this.clienteInfo) ? (this.clienteInfo.alta_freq) ? this.clienteInfo.alta_freq : false : false, [Validators.required]],
      pagado: [(this.clienteInfo) ? (this.clienteInfo.pagado) ? this.clienteInfo.pagado : false : false, [Validators.required]],
      language: [(this.clienteInfo) ? (this.clienteInfo.language) ? this.clienteInfo.language : null : null, [Validators.required]],
    });

    // leads y los nuevos tienen los campos nombre, apellidos, pais
    if(categories.LEADS === parseInt(this.type) || this.isNew) {
      this.addControlsFromGroup(this.todoForm, personalDataForm);
      // actualizar validaciones teléfono
      this.changePhoneValidators();
    }

    // si es nuevo se añaden controles user, password
    if(this.isNew) {
      this.addControlsFromGroup(this.todoForm, formNewUser);
    }

    // dependiendo de los tipos tendrá unos controles u otros
    if([categories.DEMOS, categories.CLIENTES].includes(parseInt(this.type))) {
      let formDescargarRaster = new FormControl((this.clienteInfo) ? (this.clienteInfo.descargar_raster) ? true : false : false);
      if(categories.CLIENTES === parseInt(this.type)) this.addControlsFromGroup(this.todoForm, formType3);
      this.addControlsFromGroup(this.todoForm, formType2);
      if(!this.isNew) this.todoForm.addControl('descargar_raster', formDescargarRaster);
    }
  }

  /**
   * Añade al totalForm los controles de formControls
   * @param totalForm form al que se le añadirán los controles
   * @param formControls form que contiene los controles
   */
  addControlsFromGroup(totalForm: FormGroup, formControls: FormGroup) {
    Object.keys(formControls.controls).forEach(tag => {
      totalForm.addControl(tag, formControls.controls[tag]);
    })
  }

  /** PRODUCTOS */

  /**
   * Función para obtener los productos según el area
   * @param area area que necesitamos
   * @param areas todas las areas
   */
  getProducts(area: number, areas: Area[]){
    var productosFound;
    // Obtenemos el área seleccionada
    let areaSelected = areas.find(el => el.id === area);
    // Buscamos los productos del área seleccionada
    if(this.productosGET && this.areaSelected) productosFound = this.productosGET.find(el => el.area.id === this.areaSelected);
    // Pedimos los productos si no se han cargado aún
    (productosFound) ? this.productosSelected = productosFound.productos : this.store.dispatch(loadAreaProducts({area: areaSelected}));

    // Reseteamos el plan
    this.planSelected = null
  }

  /**
   * Función para guardar los productos seleccionados
   * @param event evento html
   * @param producto producto seleccionado
   */
  onCheckboxChangeProductos(producto: Producto, i: number){
    this.store.dispatch(changeEditorProduct({producto: producto, value: !producto.check, index: i, area: this.areaSelected}))
  }

  /** HERRAMIENTAS */

  /**
   * Función para guardar las herramientas seleccionadas
   * @param evt evento html
   */
  onCkeckboxChangeHerramientas(herramienta: herramienta, i: number){
    this.store.dispatch(changeEditorHerramienta({herramienta: herramienta, value: !herramienta.check, index: i}))
  }

  /** AREAS */

  /**
   * Función para crear un área y añadirla al array
   */
  crearArea(){
    if(this.tituloArea && this.cultivoArea && this.fin_actualizacionArea){

      const datepipe: DatePipe = new DatePipe('en-US');

      this.fin_actualizacionArea = datepipe.transform(this.fin_actualizacionArea, 'YYYY-MM-dd');

      var newArea:Area = {
        titulo: this.tituloArea,
        cultivo: this.cultivoArea,
        nombre: this.tituloArea.trim().toLowerCase(),
        terminado: false,
        fin_actualizacion: this.fin_actualizacionArea,
        id_label: 'id',
        unidad_01: 'unidad_01',
        unidad_02: 'unidad_02',
        unidad_03: 'unidad_03',
        unidad_04: 'unidad_04',
        unidad_05: 'unidad_05'
      }
      this.store.dispatch(setLoading({ loading: true }));
      this.store.dispatch(createArea({clientId: this.clienteInfo.id, area: JSON.stringify(newArea)}))

      this.tituloArea = null;
      this.cultivoArea = null;
      this.fin_actualizacionArea = null;
    }
  }

  /**
   * Función que envía los datos del cliente, tanto del apartado de Información, como del de Herramientas y del de Productos
   * @param type por si se quiere cambiar el category para convertir a un usuario, saber a que tipo de usuario
   */
  async saveUser(type?: number) {
    this.store.dispatch(setLoading({ loading: true }));
    // comprobación de que los datos son correctos
    if(this.tabSelected === 0 && (this.todoForm.invalid || this.checkEmailValue || this.checkUserValue)) {
      // se ha producido algún error
      this.todoForm.markAllAsTouched();
      this.clickButton = true;
      this.store.dispatch(setLoading({ loading: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar los datos',
        text: 'Campos en Información incorrectos',
        showConfirmButton: true
      });

      return;
    }
    // Juntar el teléfono
    if(this.todoForm.controls['phone']){
      var telFormat = this.editorService.formatPhone(this.todoForm.controls['phone'].value,
      this.todoForm.controls['codePhone'].value);
    }

    // es formulario nuevo
    if(this.isNew) return this.saveNewUser(telFormat);
    else {
      let userDataSend = {};
      userDataSend['fk_contacto'] = {};

      let clientDataSend = {};
      if(this.tab === 0) {
        // ES EDITAR
        const datepipe: DatePipe = new DatePipe('en-US');

        if(parseInt(this.type) !== categories.LEADS) {
          this.todoForm.controls['fin_plataforma'].setValue(datepipe.transform(this.todoForm.controls['fin_plataforma'].value, 'YYYY-MM-dd'));
          this.todoForm.controls['fin_actualizacion'].setValue(datepipe.transform(this.todoForm.controls['fin_actualizacion'].value, 'YYYY-MM-dd'));
        }

        this.todoForm['_forEachChild']((control, name) => {

        this.changeCategory = type !== undefined && type === 3;
        clientDataSend["category"] = (type && type == 3) ? 3 : (type) ? 4 : this.clienteInfo.category;

          // Estos datos se mandan siempre porque el "control.dirty" no los coge
          if(name=='contactado' || name=='pagado' || name=='alta_freq'){
            clientDataSend[name] = control.value;
          }

          if(name=='ha_contrat' && control.value==""){
            clientDataSend[name] = 0;
          }

          if(name=='pais'){
            userDataSend['fk_contacto'][name] = control.value;
          }

          if(name=='phone'){
            if(parseInt(this.type) !== categories.LEADS) {
              // cambiar atributo phone por telefono
              let label = Object.entries(changesColumns).find(([prevKey, newKey]) => prevKey === 'phone')[1];
              clientDataSend[label] = control.value;
            } else {
              userDataSend['fk_contacto'][name] = telFormat;
            }
          }

          if(control.dirty){
            if(name=='nombre' || name=='apellidos' || name=='cultivo' || name=='email'){
              if(name === 'email' && parseInt(this.type) !== categories.LEADS) {
                //cambiar atributo email por correo
                let label = Object.entries(changesColumns).find(([prevKey, newKey]) => prevKey === 'email')[1];
                clientDataSend[label] = control.value;
              } else {
                userDataSend['fk_contacto'][name] = control.value;
              }
            }else if(name=='language'){
              userDataSend['fk_contacto'][name] = control.value;
              clientDataSend[name] = control.value;
            }else{
              if(name!='codePhone' ||
              (name === 'metodo_pago' && control.value !== this.clienteInfo['metodo_pago'])){
                clientDataSend[name] = control.value;
              }
            }
          }

        });
      }
      this.store.dispatch(editClient({ clientId: this.clienteInfo.id,
        clientData: clientDataSend,
        userId: this.clienteInfo.userId,
        userData: JSON.stringify(userDataSend),
        client: this.clienteInfo,
        tab: this.tabSelected
      }));

    }
  }

  saveNewUser(telFormat: string) {
    // datos necesarios para el registro
    const user: UserRegisterInterface = {
      user: this.todoForm.get('user').value,
      email: this.todoForm.get('email').value,
      password: this.todoForm.get('password').value,
      nombre: this.todoForm.get('nombre').value,
      apellidos: this.todoForm.get('apellidos').value,
      phone: telFormat,
      cultivo: this.todoForm.get('cultivo').value,
      pais: this.todoForm.get('pais').value,
      ha_empresa: this.todoForm.get('ha_empresa').value,
      empresa: this.todoForm.get('empresa').value,
      discovery_way: 8,
      language: this.todoForm.get('language').value
    }

    const datepipe: DatePipe = new DatePipe('en-US');

    // datos del cliente
    const client = {
      fin_actualizacion: datepipe.transform(this.todoForm.controls['fin_actualizacion'].value, 'YYYY-MM-dd'),
      fin_plataforma: datepipe.transform(this.todoForm.controls['fin_plataforma'].value, 'YYYY-MM-dd'),
      alta_freq: (parseInt(this.type) === categories.CLIENTES) ? this.todoForm.controls['alta_freq'].value : null,
      contactado: (parseInt(this.type) === categories.CLIENTES) ? this.todoForm.controls['contactado'].value : null,
      ha_contrat: (parseInt(this.type) === categories.CLIENTES) ?
        (this.todoForm.controls['alta_freq'].value) ?
        this.todoForm.controls['ha_contrat'].value :
        null : null,
      metodo_pago: (parseInt(this.type) === categories.CLIENTES) ? this.todoForm.controls['metodo_pago'].value : null,
      ha_contrat_sent: (parseInt(this.type) === categories.CLIENTES) ? this.todoForm.controls['ha_contrat_sent'].value : null,
      pagado: (parseInt(this.type) === categories.CLIENTES) ? this.todoForm.controls['pagado'].value : null,
    }

    this.store.dispatch(changeLoginWaiting({status: true}));
    // llamada a guardar usuario
    this.store.dispatch(saveNewUser({ user: user, client: client, category: parseInt(this.type) }));
    return true;
  }

  /**
   * Cambiar el validador de ha_contrat según el valor de alta_freq
   */
  changeValidatorHaContract() {
    // añadir validador o no según el valor de alata_freq
    if(this.todoForm.get('alta_freq').value) {
      this.todoForm.get('ha_contrat').setValidators(Validators.required);
      if (this.clienteInfo) this.todoForm.get('ha_contrat').setValue(this.clienteInfo.ha_contrat);
    }
    else {
      this.todoForm.get('ha_contrat').clearValidators();
      // reseteamos el valor de ha_contrat
      if (this.clienteInfo) this.todoForm.get('ha_contrat').setValue((this.clienteInfo.ha_contrat) ? 0 : null);
    }
    // actualizar control form
    this.todoForm.get('ha_contrat').updateValueAndValidity();
  }

  //PARA EL TELÉFONO

  /**
   * Formatea la extensión telefónica
   * @param phone telefono completo
   * @returns número y código por separado
   */
  check_extension_phone(phone: String) {
    if (phone && phone.includes("+")) {
      // eliminamos el + del número y todo carácter que no sea número
      let phone_number = phone.split('').filter(element => !isNaN(parseInt(element))).join('');
      // obtenemos el país al que hace referencia
      let countriesPhone = Object.keys(countries).filter(element => phone_number.startsWith(countries[element].phone.split(',')[0])).map(element => countries[element]);
      let countryPhone = countriesPhone.reduce((act, element) => {
        if(!act) return element;
        return (act.phone > element.phone) ? act : element;
      }, undefined);
      let country = telData.allCountries.find(element => element.name.includes(countryPhone.name));
      // coger formato actual del teléfono
      if(country) {
        this.changePhoneFormat(country.iso2.toUpperCase());
        let final_phone = '';
        if(this.phoneFormat) {
          // existe formato, transformamos el teléfono al formato correcto
          let new_phone = phone_number.slice(country.dialCode.split(',')[0].length).split('').filter(e => /[0-9]/.test(e));
          this.phoneFormat.split('').forEach(element => {
            (new_phone.length > 0) ?
            (/[0-9]/.test(element)) ? final_phone += new_phone.shift() : final_phone += element : final_phone += '';
          })
          if(new_phone.length > 0) final_phone += new_phone.join('');
        }
        return { "number": (this.phoneFormat) ? final_phone : phone_number.slice(country.dialCode.split(',')[0].length), "phone_option": country.iso2.toUpperCase() }
      }
    }
    return { "number": phone, "phone_option": null }
  }

  /**
   * Formatea la extensión telefónica
   * @param event evento del html
   */
  changePhoneFormat(event) {
    let country = telData.allCountries.find(element => element.iso2 === event.toLowerCase());
    this.phoneFormat = country.format;
    if(this.phoneFormat) {
      this.separador = (country.format.includes('-')) ? '-' : ' ';
      // Se comprueba si existe el formato del país
      if(country.format.includes(')')) this.phoneFormat = country.format.split(')')[1].split('').map(element => (element === '.') ? '5' : element).join('');
      else {
        let phoneFormatArray: string[] = country.format.split(this.separador);
        phoneFormatArray.shift();
        // añadir formato con números en vez de puntos para mayor visibilidad
        this.phoneFormat = phoneFormatArray.join(this.separador).split('').map(element => (element === '.') ? '5' : element).join('');
      }
    }
  }

  /**
   * Función que formatea el formato del número del país seleccionado
   * @param event evento que contiene el formato de número del país seleccionado
   */
  changePhoneCode(event) {
    this.todoForm.get('phone').enable();

    this.changePhoneFormat(event);
    this.changePhoneValidators();
    this.todoForm.get('phone').reset('');
    this.clearKeysCountriesFilter();
  }

  /**
   * Actualiza validaciones teléfono
   */
  changePhoneValidators() {
    if(this.phoneFormat) {
      // cambiar validador del phone al formato adecuado
      this.todoForm.get('phone').setValidators([Validators.required, Validators.maxLength(this.phoneFormat.length), Validators.minLength(this.phoneFormat.length)]);
      this.todoForm.get('phone').updateValueAndValidity();
    }else{
      this.todoForm.get('phone').setValidators([]);
    }
  }

  /**
   * Función que resetea el input de búsqueda
   * @param event
   */
  clearKeysCountriesFilter(event?) {
    this.keysCountriesFilter = this.keysCountries;
    this.todoForm.get('inputFilter').reset('');
  }

  /**
   * Función que filtra los paises
   * @param text texto del código a filtrar
   */
   onKeyCountry(text: string) {
    if(text === '') this.keysCountriesFilter = this.keysCountries;
    else {
      this.keysCountriesFilter = this.keysCountries.filter(element => {
        return countries[element].name.toLowerCase().includes(text);
      })
    }
  }

  /**
   * Función que filtra los códigos de teléfono
   * @param text texto del código a filtrar
   */
   onKeyCode(text: string) {
    if(text === '' || text === '+') this.keysCountriesFilter = this.keysCountries;
    else {
      if(text.includes('+')) text = text.replace('+', '')
      this.keysCountriesFilter = this.keysCountries.filter(element => {
        return countries[element].phone.includes(text);
      })
    }
  }

  /**
   * Función que controla la entrada del input phone
   * @param event evento del input del teléfono
   * @returns boolean: true si es un número y si aún no cumple el formato, false el resto
   */
   controlTel(event) {
    return !isNaN(parseInt(event.key)) && (!this.phoneFormat || (this.todoForm.get('phone').value.length + 1 <= this.phoneFormat.length)) ;
  }

  /**
   * Función que comprueba la entrada y ajusta el contenido del input al formato
   * @param event evento input del teléfono
   */
   addSeparador(event) {
    if(this.phoneFormat) {
      let inputTel = this.todoForm.get('phone').value.split('').filter(element => element !== this.separador);
      this.todoForm.get('phone').reset(this.phoneFormat.split('').reduce((actPhoneFormat, element) => {
        if(inputTel.length > 0) {
          if(element === this.separador) actPhoneFormat += this.separador;
          else {
            let num = inputTel.shift();
            actPhoneFormat += num;
          }
        }
        return actPhoneFormat;
      }, ''));
    }
  }

  /** ZAFRAS */

  /**
   * Función para crear una nueva zafra con el botón +
   */
  addZafra(){

    var newZafra:zafra = {
      nombre: "Zafra"+this.contZafras,
      csv: false,
      zip: false,
      errores: false,
      send: false,
      tipo: "shapefile",
      addCompare: "añadir",
      idcsv: "csv"+this.contZafras,
      idzip: "zip"+this.contZafras,
      apodo: "Zafra"+this.contZafras,
      historico: false
    }

    this.zafras.push(newZafra);

    this.contZafras++;

  }

  /**
   * Vuelve a la página anterior
   */
  goBack() {
    // preguntar si hay cambios
    if(!this.isNew && (this.tabSelected === 1 && this.isHerramientasChanged() ||
      this.tabSelected === 3 && this.isProductosChanged() ||
      this.tabSelected === 0 && this.isDataFormChanged())) {
        Swal.fire({
          title: 'Cambios sin guardar',
          text: "¿Salir sin guardar?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // parte la url que deriva al editor y coge la raíz (ej: /admin/demos)
            this.router.navigateByUrl(this.router.url.split('/').slice(0, 3).join('/'))
            //this.location.back();
          }
        });
    } else {
      // parte la url que deriva al editor y coge la raíz (ej: /admin/demos)
      this.router.navigateByUrl(this.router.url.split('/').slice(0, 3).join('/'))
      //this.location.back();
    }
  }

  /**
   * Función que realiza la llamada a comprobar si existe el usuario y el email
   * @param value valor a checkear
   * @param input que se checkea(email, usuario)
   */
  async checkUser(value:string, input: string) {
    if(input === 'email' && !this.isNew && value === this.previous_email) this.checkEmailValue = false;
    else{
      const result = await this.editorService.checkUserExists({ [input]: value });
      // guardamos resultado en el valor adecuado
      (input === 'user') ? this.checkUserValue = result : this.checkEmailValue = result;
    }
  }

  /**
   * Función para verificar que el campo solicitado no comienza con un número
   * @param value valor a checkear
   * @param input que se checkea(empresa, área)
   */
  async checkFirstCharacter(value, input: string){
    if(input == "area"){
      if(value.length>0 && isNaN(value.charAt(0)) == false){
        this.checkTituloAreaValue = true;
      }else{
        this.checkTituloAreaValue = false;
      }
    }
  }

  /**
   * Función para convertir a cliente o dar de baja
   * @param type category
   */
  convertir(type){
    if (type == 1) {
      this.changeCategory = true;
      Swal.fire({
        title: '¿Quieres convertir a cliente?',
        text: "No hay vuelta atrás",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(editClient({ clientId: this.clienteInfo.id,
            clientData: { category: 3 },
            userId: this.clienteInfo.userId,
            userData: null,
            client: this.clienteInfo,
            tab: this.tabSelected
          }));
          //this.saveUser(3);
        }
      })

    }else{

      Swal.fire({
        title: '¿Quieres dar de baja?',
        text: "No hay vuelta atrás. Se dará de baja el cliente (ya no podrá entrar a la plataforma), las áreas del cliente (ya no se actualizarán) y sus polígonos (se desactivarán).",
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          /* this.store.dispatch(editClient({ clientId: this.clienteInfo.id,
            clientData: { category: 4 },
            userId: this.clienteInfo.userId,
            userData: null,
            client: this.clienteInfo,
            tab: this.tabSelected
          })); */
          this.store.dispatch(expireClient({client: this.clienteInfo}))
        }
      })

    }
  }

  /**
   * Función que indica si se ha cambiado algún dato del formulario
   * @returns si ha cambiado algún dato del formulario información
   */
  isDataFormChanged() {
    const datepipe: DatePipe = new DatePipe('en-US');
    return !Object.keys(this.todoForm.controls).reduce((act, label) => {
      if(this.todoForm.controls[label].value instanceof Date) {
        // se necesita formatear la fecha
        return act && datepipe.transform(this.todoForm.controls[label].value, 'YYYY-MM-dd') === this.clienteInfo[label];
      } else if(label === 'phone') {
        // se necesita formatear el teléfono
        return act && this.clienteInfo[label] === this.editorService.formatPhone(this.todoForm.controls[label].value, this.todoForm.controls['codePhone'].value);
      }
      return act && (['codePhone', 'inputFilter'].includes(label) || (this.todoForm.controls[label].value === this.clienteInfo[label] ||
        (this.clienteInfo[label] === null && this.todoForm.controls[label].value === '') ||
        (this.todoForm.controls[label].value === false && !this.clienteInfo[label])));
    }, true)
  }

  /**
   * Función que indica si han cambiado los productos
   * @returns si ha cambiado algún dato de productos
   */
  isProductosChanged() {
    return this.copyProductos !== null &&
    this.copyProductos.some(element => JSON.stringify(element.productos) !== JSON.stringify(this.productosGET.find(areas => areas.area.id === element.area.id).productos));
  }

  /**
   * Función que indica si han cambiado las herramientas
   * @returns si ha cambiado algún dato de herramientas
   */
  isHerramientasChanged() {
    return JSON.stringify(this.copyHerramientas) !== JSON.stringify(this.herramientasGET);
  }

  /**
   * CLOSE TOOL
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    // resetear el editor
    this.store.dispatch(clearEditorState());
    // resetear el token de superuser
  }

  /** PLANES */
  selectPlan(titulo: string, type: string){
    // Obtenemos los productos y herramientas del plan seleccionado
    var plan = this.planService.getSelectedPlan(titulo,this.plans)

    // Editamos las herramientas seleccionadas
    if(type=='herramientas'){
      this.herramientasGET.forEach((element, index) => {
        if(plan.herramientas.find(el=>el==element.nombre)){
          this.store.dispatch(changeEditorHerramienta({herramienta: element, value: true, index: index}))
        }else{
          this.store.dispatch(changeEditorHerramienta({herramienta: element, value: false, index: index}))
        }
      });
    }

    // Editamos los productos seleccionados
    if(type=='productos'){
      var productosArea = this.productosGET.find(el=>el.area.id == this.areaSelected)
      if(productosArea){
        productosArea.productos.forEach((element, index) => {
          if(plan.productos.find(el=>el==element.nombre)){
            this.store.dispatch(changeEditorProduct({producto: element, value: true, index: index, area: this.areaSelected}))
          }else{
            this.store.dispatch(changeEditorProduct({producto: element, value: false, index: index, area: this.areaSelected}))
          }
        });
      }
    }
  }


}
