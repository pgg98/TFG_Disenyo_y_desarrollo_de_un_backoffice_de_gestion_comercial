import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { getAreasAll, getAreasCliente, getCurvas, getCurvasBorrar, getCurvasFilter, getCurvasSeleccionar, getLoadingCurvas, getProductosArea, getUniques } from '../../editor/state/editor.selector';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addBorrarCurvas, areasAll, asignarCurvas, borrarCurvas, curvasOptimas, loadAreaProducts, setCurveFilter, uniques, vaciarCurvas } from '../../editor/state/editor.actions';
import { buttonsEachTabla } from '../../constants/columnsTable';
import { setLoading } from 'src/app/pages/admin/state/admin.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/interfaces/Pagination.interface';

@Component({
  selector: 'app-asignar-curvas',
  templateUrl: './asignar-curvas.component.html',
  styleUrls: ['./asignar-curvas.component.scss']
})
export class AsignarCurvasComponent implements OnInit {

  public ngUnsubscribe: Subject<any> = new Subject();
  areas:any[]; // Areas de la plataforma
  areaAsignar:any = {}; // Area a asignar las curvas
  productoFiltro:any; // Producto seleccionado como filtro
  variedadFiltro:any; // Variedad seleccionada como filtro
  areaSeleccionar:any; // Area de la que obtener las curvas que se asignan
  productosArea:any[]; // Productos del área a asignar
  productosAreaFiltrados:any[]; // Productos disponibles para asignar curvas por ahora
  variedadesArea:any[]; // Variedad del área a asignar
  bodyVariedades:any; // Body de la petición para pedir las variedades del área a asignar
  areasAll:any[]; // Todas las área que existen
  buttonsCurva = buttonsEachTabla['curvas']; // Botones para la tabla de curvas
  curvas:Pagination; // Curvas del área a asignar
  curvasSeleccionar:Pagination; // Curvas del área seleccionar
  productosCurvas:any[] = ['agua','lai','clorofila','ndvi']; // Productos disponibles para asignar curvas por ahora
  curvasBorrar:any[]; // Curvas seleccionadas en la tabla para borrar
  spinnerSeleccionar:boolean = false; // Boolean que controla si el spinner del área seleccionar está activo
  actualPage:number = 1; // Página actual de la tabla de curvas
  actualFilter: Object; // Filtro actual aplicado, en este caso de variedad
  allChecked: boolean = false;
  orderedBy: string;
  loadingCurvas: boolean;
  getVariedadesToAssign: boolean = false;

  constructor(
    public store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public dataInput,
    public dialogRef: MatDialogRef<AsignarCurvasComponent>,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    // Obtenemos la data del input
    this.areaAsignar = dataInput.element;
  }

  ngOnInit(): void {
    // Ponemos la tabla cargando
    this.store.dispatch(setLoading({ loading: true }));

    // Rellenamos el body para pedir las variedades del área a asignar
    this.bodyVariedades = `{"atributo":"variedad","activo":true}`;

    // Pedimos todas las áreas de que existen filtradas por el cultivo del área a asignar
    this.store.dispatch(areasAll({filtros:this.areaAsignar.cultivo ? [this.areaAsignar.cultivo] : []}));

    // Cargamos los productos del área a asignar
    this.store.dispatch(loadAreaProducts({area: this.areaAsignar,tipo: 'asignar'}));

    // Pedimos las variedades del área a asignar
    this.store.dispatch(uniques({areaId:this.areaAsignar.id, datos:this.bodyVariedades}));

    // Pedimos las curvas óptimas del área a asignar
    this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:`{"areas": [${this.areaAsignar.id}],"product": ["agua","lai","clorofila","ndvi"]}`, area:this.areaAsignar}));

    // Cogemos las áreas que tiene creadas el cliente
    this.store.select(getAreasCliente).pipe(takeUntil(this.ngUnsubscribe)).subscribe(areas=>{this.areas=areas;});

    // Cogemos los productos del área a asignar
    this.store.select(getProductosArea).pipe(takeUntil(this.ngUnsubscribe)).subscribe(productos=>{
      if(productos){
        this.productosAreaFiltrados = [];
        this.productosArea = productos;
        // De momento los únicos productos disponibles para las Curvas son los siguientes
        this.productosArea.map(value=>{if(value.nombre=='ndvi' || value.nombre=='agua' || value.nombre=='clorofila' || value.nombre=='lai') this.productosAreaFiltrados.push(value);});
        // Controlamos el filtro de producto por si hay que borralo o mantenerlo
        if (this.productoFiltro) {
          let encontrado = this.productosAreaFiltrados.filter(value=>value.nombre==this.productoFiltro.nombre);
          if(encontrado.length>0){
            this.filtrosAsignar(1,encontrado);
          }else{
            this.productoFiltro = null;
          }
        }
      }
    });

    // Cogemos las variedades del área a asignar
    this.store.select(getUniques).pipe(takeUntil(this.ngUnsubscribe)).subscribe(variedades=>{
      this.variedadesArea=variedades;
      if(this.actualFilter){
        let encontrado = this.variedadesArea.filter(value=>value==this.variedadFiltro);
        if(encontrado.length==0){
          this.store.dispatch(setCurveFilter({ filter: null }));
          this.variedadFiltro = null;
        }
      }
    });

    // Cogemos todas las área que existen filtradas por el producto del área a asignar
    this.store.select(getAreasAll).pipe(takeUntil(this.ngUnsubscribe)).subscribe(areasAll=>{this.areasAll=areasAll;});

    // Cogemos las curvas del área a asignar y actualizamos la página de la tabla
    this.store.select(getCurvas).pipe(takeUntil(this.ngUnsubscribe)).subscribe(curvas=>{
      if(curvas === null || this.getVariedadesToAssign == true){this.store.dispatch(setLoading({ loading: true })); this.getVariedadesToAssign = false;}
      else{this.store.dispatch(setLoading({ loading: false }));}
      if(curvas){
        let corte = 6;
        if(curvas.current && curvas.current.split('/').length != 9) corte = 3;
        let change = curvas.current.split('/').slice(corte);
        // son los datos de la categoría actual
        this.actualPage = parseInt(change[0]);

        this.curvas=null;
        this.curvas=curvas;

        if(this.curvas.objects < 10){
          const curvasCopy = {...curvas};
          curvasCopy.limit = this.curvas.objects;
          this.curvas = curvasCopy;
        }

        //Comprobar si todas las curvas están checked para cambiar el check global de la tabla
        let encontradas = 0;
        this.curvasBorrar.map(curvaBorrar=>{
          curvas.datos.map(curva=>{
            if(curva['id']==curvaBorrar['id']){
              encontradas = encontradas + 1;
            }
          })
        })
        if(encontradas==curvas.datos.length){this.allChecked=true;}
        else{this.allChecked=false;}
      }
    });

    // Cogemos las curvas seleccionadas en la tabla para borrar
    this.store.select(getCurvasBorrar).pipe(takeUntil(this.ngUnsubscribe)).subscribe(curvasBorrar=>{this.curvasBorrar=curvasBorrar;});

    // Cogemos las curvas del área seleccionar
    this.store.select(getCurvasSeleccionar).pipe(takeUntil(this.ngUnsubscribe)).subscribe(curvas=>{
      if (curvas){
        this.curvasSeleccionar = null;
        this.curvasSeleccionar = curvas;
        this.spinnerSeleccionar = false;
      }
    });

    // Cogemos el filtro (en este caso de variedad) que está aplicado
    this.store.select(getCurvasFilter)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.actualFilter = value;
      }
    );

    // Vaciamos las curvas a borrar
    this.store.dispatch(addBorrarCurvas({ curvas: this.curvasBorrar , add: false}));

    this.store.select(getLoadingCurvas)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.loadingCurvas = value;
      }
    );
  }

  /**
   * Se piden las curvas de un área en concreto
   * @param tipo 1 si es el área a Asignar, 2 si es el área de donde se seleccionan las curvas
   */
  pedirCurvas(tipo){
    if(tipo==1){
      this.orderedBy = '';
      this.store.dispatch(addBorrarCurvas({ curvas: this.curvasBorrar , add: false}));
      this.store.dispatch(setCurveFilter({ filter: null }));
      this.productoFiltro = null;
      this.variedadFiltro = null;
      this.areaSeleccionar = null;
      this.curvasSeleccionar = null;
      this.store.dispatch(setLoading({ loading: true }));
      this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:JSON.stringify({areas: [this.areaAsignar.id],product:["agua","lai","clorofila","ndvi"]}), area:this.areaAsignar}));
      this.store.dispatch(areasAll({filtros:this.areaAsignar.cultivo ? [this.areaAsignar.cultivo] : []}));
    }else{
      this.spinnerSeleccionar=true;
      this.store.dispatch(curvasOptimas({url:`/rest/curvasoptimaspage`, tipo:2, body:`{"areas": [${this.areaSeleccionar.id}],"product": ["agua","lai","clorofila","ndvi"]}`, area:this.areaSeleccionar}));
    }
  }

  /**
   * Se aplican los filtros de producto y variedad
   * @param tipo 1 si es el filtro de producto, 2 si es el filtro de variedad
   * @param filtro Evento del filtro
   */
  filtrosAsignar(tipo,filtro){
    if(tipo == 1 && filtro && filtro!=this.productoFiltro && Array.isArray(filtro)==false){
      this.store.dispatch(addBorrarCurvas({ curvas: this.curvasBorrar , add: false}));
      this.orderedBy = '';
      this.store.dispatch(setLoading({ loading: true }));
      this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:JSON.stringify({areas: [this.areaAsignar.id],product: [filtro.nombre], filtro:this.actualFilter ? {variedad__in:[this.actualFilter]} : {}}), area:this.areaAsignar}));
      this.productoFiltro=filtro;
    }else if(tipo == 2 && filtro && filtro!=this.variedadFiltro){
      this.store.dispatch(addBorrarCurvas({ curvas: this.curvasBorrar , add: false}));
      this.orderedBy = '';
      this.store.dispatch(setLoading({ loading: true }));
      this.store.dispatch(setCurveFilter({ filter: filtro }));
      this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:JSON.stringify({areas: [this.areaAsignar.id],product: this.productoFiltro ? [this.productoFiltro.nombre] : ["agua","lai","clorofila","ndvi"], filtro:{variedad__in:[filtro]}}), area:this.areaAsignar}));
      this.variedadFiltro=filtro;
    }
    this.store.dispatch(setLoading({ loading: false }));
  }

  /**
   * Se asignan las curvas del área del que se seleccionan al área asignar
   */
  asignar(){
    this.store.dispatch(addBorrarCurvas({ curvas: this.curvasBorrar , add: false}));
    this.orderedBy = '';
    this.productoFiltro = null;
    this.variedadFiltro = null;
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(curvasOptimas({url:`/rest/curvasoptimaspage/1/${this.curvasSeleccionar.objects}/variedad`, tipo:2, body:`{"areas": [${this.areaSeleccionar.id}],"product": ["agua","lai","clorofila","ndvi"]}`, area:this.areaSeleccionar}));
    this.getVariedadesToAssign = true;
    this.store.select(getCurvasSeleccionar).pipe(takeUntil(this.ngUnsubscribe)).subscribe(curvas=>{
      if(curvas && curvas.limit==curvas.objects){
        this.curvasSeleccionar = curvas;
        this.store.dispatch(asignarCurvas({area:this.areaAsignar, productos:this.productosAreaFiltrados, curvasSeleccionar:this.curvasSeleccionar.datos}));
        this.areaSeleccionar=null;
        this.curvasSeleccionar=null;
      }
    });
  }

  /**
   * Con las curvas seleccionadas en la tabla se borran del área a asignar
   */
  borrar(){
    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(borrarCurvas({area:this.areaAsignar, productos:this.productoFiltro ? [this.productoFiltro.nombre] : ["agua","lai","clorofila","ndvi"], borrar:this.curvasBorrar, curvas:this.curvas, variedad:this.actualFilter}));
  }

  /**
   * Cierra el diálogo
   */
  closeTool(){
    this.dialogRef.close();
  }

  /**
   * Se borra el filtro correspondiente
   * @param tipo 1 si es el filtro de producto, 2 si es el filtro de variedad
   */
  limpiarFiltro(tipo){
    this.store.dispatch(setLoading({ loading: true }));
    let nombresProductos = [];
    this.productosAreaFiltrados.map(producto => { nombresProductos.push(producto.nombre) });
    this.orderedBy = '';
    this.store.dispatch(addBorrarCurvas({ curvas: this.curvasBorrar , add: false}));
    if(tipo==1){
      this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:JSON.stringify({areas: [this.areaAsignar.id],product: nombresProductos, filtro:this.actualFilter ? {variedad__in:[this.actualFilter]} : {}}), area:this.areaAsignar}));
      this.store.dispatch(setLoading({ loading: false }));
      this.productoFiltro = null;
    }else{
      this.store.dispatch(setCurveFilter({ filter: null }));
      this.store.dispatch(curvasOptimas({url:'/rest/curvasoptimaspage', tipo:1, body:JSON.stringify({areas: [this.areaAsignar.id],product: this.productoFiltro ? [this.productoFiltro.nombre] : nombresProductos, filtro:{}}), area:this.areaAsignar}));
      this.store.dispatch(setLoading({ loading: false }));
      this.variedadFiltro = null;
    }
  }

  /**
   * Función que prepara la peición para ordenar por columna de forma ascendente o descendente
   * @param column columna referenciada para realizar la ordenación
   */
  changeOrder(column: string) {
    let corte = 6, pre = '', guion = '';
    if(column.includes('-')) guion = '-';
    let url = this.curvas.current.split('/');
    if(url.length === 6) corte = 3;
    let change = url.splice(corte);
    change[0] = '1';
    change[2] = guion + pre + column.replace('-', '');
    this.orderedBy = change[2];
    let body = {areas:[],product:this.productoFiltro ? [this.productoFiltro.nombre] : ["agua","lai","clorofila","ndvi"],filtro:this.actualFilter ? {variedad__in:[this.actualFilter]} : {}};
    body.areas = [this.areaAsignar.id];

    this.store.dispatch(setLoading({ loading: true }));
    this.store.dispatch(curvasOptimas({ url: url.concat(change).join('/'), tipo:1, body: JSON.stringify(body), area:this.areaAsignar }));
  }

  /**
   * Función que prepara la llamada para cambiar la página
   * @param pag pagina a la que se navega
   */
  changePage(pag: number) {
    this.store.dispatch(setLoading({ loading: true }));
    let corte = 6;
    let url = this.curvas.current.split('/');
    // llamada usuarios o categoria
    if(url.length !== 9) corte = 3;
    // ['1', '10', 'user']
    let change = url.splice(corte);
    let actualPag = parseInt(change[0]);

    let body = {areas:[],product:this.productoFiltro ? [this.productoFiltro.nombre] : ["agua","lai","clorofila","ndvi"],filtro:this.actualFilter ? {variedad__in:[this.actualFilter]} : {}};
    body.areas = [this.areaAsignar.id];

    if(pag === actualPag + 1) this.store.dispatch(curvasOptimas({ url: this.curvas.next, tipo:1, body: JSON.stringify(body), area:this.areaAsignar }))
    else if(pag === actualPag - 1) this.store.dispatch(curvasOptimas({ url: this.curvas.previous, tipo:1, body: JSON.stringify(body), area:this.areaAsignar}))
    else {
      change[0] = pag + '';
      this.store.dispatch(curvasOptimas({ url: url.concat(change).join('/'), tipo:1, body: JSON.stringify(body), area:this.areaAsignar}));
    }
  }

  /**
   * Cambia el límite de la página
   * @param limit límite a cambiar
   */
  changeLimit(limit: number) {
    this.store.dispatch(setLoading({ loading: true }));
    let corte = 6;
    let url = this.curvas.current.split('/');
    if(url.length === 6) corte = 3;
    let change = url.splice(corte);
    let actualPag = parseInt(change[0]);
    // obtiene primer elemento que se visualiza ahora en la tabla
    const firstObject = (actualPag - 1) * this.curvas.limit + 1;
    // calcula la página donde se visalizaría el primer elemento actual
    let newPage = Math.floor((firstObject - 1) / limit) + 1;
    change[0] = newPage + '';
    change[1] = limit + '';

    this.actualPage = newPage;
    // añadir filtro si hubiere
    let body = {areas:[],product:this.productoFiltro ? [this.productoFiltro.nombre] : ["agua","lai","clorofila","ndvi"],filtro:this.actualFilter ? {variedad__in:[this.actualFilter]} : {}};
    body.areas = [this.areaAsignar.id];

    this.store.dispatch(curvasOptimas({ url: url.concat(change).join('/'), tipo:1, body: body, area:this.areaAsignar }))
  }

  selectCurva(response: any){
    this.store.dispatch(addBorrarCurvas({ curvas: response.curva , add: response.checked}));
  }

  /**
   * CLOSE TOOL
   */
   @HostListener('unloaded')
   ngOnDestroy(): void {
    this.store.dispatch(vaciarCurvas());
    this.store.dispatch(setLoading({ loading: false }));
    this.store.dispatch(setCurveFilter({ filter: null }));
    this.curvasSeleccionar = null;
    this.curvas = null;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
